from django.db import models
from django.contrib.auth import get_user_model
from django.utils import timezone
from django.core.validators import MinValueValidator, MaxValueValidator
from django.core.exceptions import ValidationError
import uuid
import os

User = get_user_model()

class BackupSchedule(models.Model):
    """Model for backup schedules"""
    
    BACKUP_TYPES = [
        ('full', 'Full Backup'),
        ('incremental', 'Incremental'),
        ('transaction_log', 'Transaction Log'),
        ('differential', 'Differential'),
    ]
    
    FREQUENCY_TYPES = [
        ('continuous', 'Continuous (Every 15 min)'),
        ('hourly', 'Hourly'),
        ('daily', 'Daily'),
        ('weekly', 'Weekly'),
        ('monthly', 'Monthly'),
        ('custom', 'Custom Cron'),
    ]
    
    DESTINATION_TYPES = [
        ('local', 'Local Storage'),
        ('s3', 'AWS S3'),
        ('gcs', 'Google Cloud Storage'),
        ('azure', 'Azure Blob Storage'),
        ('both', 'Local + Cloud'),
        ('cold', 'Cold Storage'),
    ]
    
    STATUS_CHOICES = [
        ('active', 'Active'),
        ('paused', 'Paused'),
        ('failed', 'Failed'),
        ('disabled', 'Disabled'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    
    # Backup configuration
    backup_type = models.CharField(max_length=20, choices=BACKUP_TYPES, default='full')
    frequency = models.CharField(max_length=20, choices=FREQUENCY_TYPES, default='daily')
    cron_expression = models.CharField(max_length=100, blank=True, help_text="Custom cron for 'custom' frequency")
    
    # Schedule timing
    scheduled_time = models.TimeField(null=True, blank=True, help_text="For daily/weekly schedules")
    scheduled_day = models.PositiveSmallIntegerField(null=True, blank=True, 
                                                     help_text="Day of week (0-6 for weekly) or day of month (1-31 for monthly)")
    
    # Retention policy
    retention_days = models.PositiveIntegerField(default=30, validators=[MinValueValidator(1)])
    retention_count = models.PositiveIntegerField(default=10, validators=[MinValueValidator(1)])
    
    # Destination
    destination_type = models.CharField(max_length=20, choices=DESTINATION_TYPES, default='local')
    destination_path = models.CharField(max_length=500, blank=True)
    s3_bucket = models.CharField(max_length=200, blank=True)
    s3_path = models.CharField(max_length=500, blank=True)
    
    # Options
    compression_enabled = models.BooleanField(default=True)
    encryption_enabled = models.BooleanField(default=True)
    verification_enabled = models.BooleanField(default=True)
    notify_on_success = models.BooleanField(default=True)
    notify_on_failure = models.BooleanField(default=True)
    
    # Status
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')
    is_running = models.BooleanField(default=False)
    last_run = models.DateTimeField(null=True, blank=True)
    last_run_status = models.CharField(max_length=20, blank=True)
    last_run_message = models.TextField(blank=True)
    next_run = models.DateTimeField(null=True, blank=True)
    total_runs = models.PositiveIntegerField(default=0)
    successful_runs = models.PositiveIntegerField(default=0)
    failed_runs = models.PositiveIntegerField(default=0)
    
    # Metadata
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='backup_schedules')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['status', 'next_run']),
            models.Index(fields=['backup_type']),
        ]
    
    def __str__(self):
        return f"{self.name} ({self.get_backup_type_display()})"
    
    def clean(self):
        """Validate schedule configuration"""
        if self.frequency == 'weekly' and self.scheduled_day is None:
            raise ValidationError({'scheduled_day': 'Day of week is required for weekly schedule'})
        if self.frequency == 'monthly' and self.scheduled_day is None:
            raise ValidationError({'scheduled_day': 'Day of month is required for monthly schedule'})
        if self.frequency == 'daily' and self.scheduled_time is None:
            raise ValidationError({'scheduled_time': 'Time is required for daily schedule'})
    
    @property
    def success_rate(self):
        if self.total_runs == 0:
            return 0
        return round((self.successful_runs / self.total_runs) * 100, 2)
    
    @property
    def average_size(self):
        backups = self.backups.all()[:10]
        if not backups:
            return 0
        total = sum(b.size_bytes or 0 for b in backups if b.size_bytes)
        return total / len(backups) if len(backups) > 0 else 0


class DatabaseBackup(models.Model):
    """Model for individual backups"""
    
    BACKUP_TYPES = BackupSchedule.BACKUP_TYPES
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('running', 'Running'),
        ('success', 'Success'),
        ('failed', 'Failed'),
        ('warning', 'Warning'),
        ('verified', 'Verified'),
        ('expired', 'Expired'),
        ('deleted', 'Deleted'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    schedule = models.ForeignKey(BackupSchedule, on_delete=models.SET_NULL, null=True, blank=True, related_name='backups')
    name = models.CharField(max_length=500)
    backup_type = models.CharField(max_length=20, choices=BACKUP_TYPES)
    
    # File details
    filename = models.CharField(max_length=500)
    file_path = models.CharField(max_length=1000)
    file_size = models.CharField(max_length=50, help_text="Human readable size", blank=True)
    size_bytes = models.BigIntegerField(null=True, blank=True)
    checksum = models.CharField(max_length=128, blank=True)
    checksum_type = models.CharField(max_length=20, default='sha256')
    
    # Backup metadata
    database_name = models.CharField(max_length=200, default='default')
    database_version = models.CharField(max_length=50, blank=True)
    backup_version = models.CharField(max_length=20, default='1.0')
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    started_at = models.DateTimeField(null=True, blank=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    
    @property
    def duration(self):
        if self.started_at and self.completed_at:
            delta = self.completed_at - self.started_at
            seconds = delta.total_seconds()
            if seconds < 60:
                return f"{seconds:.0f} sec"
            elif seconds < 3600:
                return f"{seconds/60:.1f} min"
            else:
                return f"{seconds/3600:.1f} hours"
        return None
    
    @property
    def duration_seconds(self):
        if self.started_at and self.completed_at:
            return (self.completed_at - self.started_at).total_seconds()
        return 0
    
    # Status
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    verification_status = models.CharField(max_length=20, blank=True)
    verified_at = models.DateTimeField(null=True, blank=True)
    
    # Location
    location_type = models.CharField(max_length=20, choices=BackupSchedule.DESTINATION_TYPES, default='local')
    location_path = models.CharField(max_length=1000)
    s3_bucket = models.CharField(max_length=200, blank=True)
    s3_key = models.CharField(max_length=1000, blank=True)
    
    # Options
    compression_enabled = models.BooleanField(default=True)
    encryption_enabled = models.BooleanField(default=True)
    encryption_algorithm = models.CharField(max_length=50, blank=True)
    
    # Logs and errors
    log_file = models.CharField(max_length=1000, blank=True)
    error_message = models.TextField(blank=True)
    warning_message = models.TextField(blank=True)
    
    # Metadata
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='created_backups')
    metadata = models.JSONField(default=dict, blank=True)
    
    # Expiry
    expires_at = models.DateTimeField(null=True, blank=True)
    deleted_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['status', 'created_at']),
            models.Index(fields=['backup_type']),
            models.Index(fields=['expires_at']),
        ]
    
    def __str__(self):
        return f"{self.name} ({self.created_at.strftime('%Y-%m-%d %H:%M')})"
    
    def save(self, *args, **kwargs):
        if not self.expires_at and self.schedule:
            self.expires_at = timezone.now() + timezone.timedelta(days=self.schedule.retention_days)
        super().save(*args, **kwargs)


class BackupLog(models.Model):
    """Detailed logs for backup operations"""
    
    LOG_LEVELS = [
        ('info', 'Info'),
        ('success', 'Success'),
        ('warning', 'Warning'),
        ('error', 'Error'),
        ('debug', 'Debug'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    backup = models.ForeignKey(DatabaseBackup, on_delete=models.CASCADE, related_name='logs')
    schedule = models.ForeignKey(BackupSchedule, on_delete=models.CASCADE, related_name='logs', null=True)
    
    timestamp = models.DateTimeField(auto_now_add=True)
    level = models.CharField(max_length=20, choices=LOG_LEVELS, default='info')
    message = models.TextField()
    details = models.JSONField(default=dict, blank=True)
    
    class Meta:
        ordering = ['-timestamp']
        indexes = [
            models.Index(fields=['backup', 'timestamp']),
            models.Index(fields=['level']),
        ]
    
    def __str__(self):
        return f"{self.get_level_display()}: {self.message[:50]}"


class BackupStatistics(models.Model):
    """Aggregated backup statistics"""
    
    date = models.DateField(unique=True)
    
    # Counts
    total_backups = models.PositiveIntegerField(default=0)
    successful_backups = models.PositiveIntegerField(default=0)
    failed_backups = models.PositiveIntegerField(default=0)
    
    # Size
    total_size_bytes = models.BigIntegerField(default=0)
    total_size_gb = models.FloatField(default=0)
    average_size_bytes = models.BigIntegerField(default=0)
    
    # By type
    full_backups = models.PositiveIntegerField(default=0)
    incremental_backups = models.PositiveIntegerField(default=0)
    transaction_logs = models.PositiveIntegerField(default=0)
    
    # Storage
    local_storage_gb = models.FloatField(default=0)
    cloud_storage_gb = models.FloatField(default=0)
    cold_storage_gb = models.FloatField(default=0)
    
    # Performance
    total_duration_seconds = models.PositiveIntegerField(default=0)
    average_duration_seconds = models.FloatField(default=0)
    
    # Schedules
    active_schedules = models.PositiveIntegerField(default=0)
    paused_schedules = models.PositiveIntegerField(default=0)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-date']
        verbose_name_plural = "Backup statistics"
    
    def __str__(self):
        return f"Statistics for {self.date}"


class BackupDestination(models.Model):
    """Configured backup destinations"""
    
    DESTINATION_TYPES = BackupSchedule.DESTINATION_TYPES
    STATUS_CHOICES = [
        ('active', 'Active'),
        ('inactive', 'Inactive'),
        ('error', 'Error'),
        ('maintenance', 'Maintenance'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=200)
    type = models.CharField(max_length=20, choices=DESTINATION_TYPES)
    
    # Connection details
    host = models.CharField(max_length=500, blank=True)
    port = models.IntegerField(null=True, blank=True)
    username = models.CharField(max_length=200, blank=True)
    password_encrypted = models.CharField(max_length=500, blank=True)
    
    # Cloud specific
    bucket_name = models.CharField(max_length=200, blank=True)
    region = models.CharField(max_length=100, blank=True)
    access_key = models.CharField(max_length=500, blank=True)
    secret_key_encrypted = models.CharField(max_length=500, blank=True)
    
    # Paths
    base_path = models.CharField(max_length=1000)
    
    # Capacity
    total_space_gb = models.FloatField(null=True, blank=True)
    used_space_gb = models.FloatField(default=0)
    free_space_gb = models.FloatField(null=True, blank=True)
    
    # Status
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')
    last_checked = models.DateTimeField(null=True, blank=True)
    last_error = models.TextField(blank=True)
    
    # Metadata
    is_default = models.BooleanField(default=False)
    is_available = models.BooleanField(default=True)
    priority = models.IntegerField(default=100)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-is_default', 'priority']
    
    def __str__(self):
        return f"{self.name} ({self.get_type_display()})"
    
    @property
    def usage_percentage(self):
        if self.total_space_gb and self.total_space_gb > 0:
            return round((self.used_space_gb / self.total_space_gb) * 100, 1)
        return 0
    
    @property
    def free_space_gb_calculated(self):
        if self.total_space_gb and self.used_space_gb:
            return self.total_space_gb - self.used_space_gb
        return self.free_space_gb