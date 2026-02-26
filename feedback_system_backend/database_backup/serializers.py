from rest_framework import serializers
from datetime import timedelta
from .models import (
    BackupSchedule, DatabaseBackup, BackupLog, 
    BackupStatistics, BackupDestination
)
from django.utils import timezone
import humanize

class BackupScheduleSerializer(serializers.ModelSerializer):
    success_rate = serializers.FloatField(read_only=True)
    average_size = serializers.SerializerMethodField()
    last_run_humanized = serializers.SerializerMethodField()
    next_run_humanized = serializers.SerializerMethodField()
    created_by_name = serializers.CharField(source='created_by.get_full_name', read_only=True)
    backup_type_display = serializers.CharField(source='get_backup_type_display', read_only=True)
    frequency_display = serializers.CharField(source='get_frequency_display', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    
    class Meta:
        model = BackupSchedule
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'updated_at', 'total_runs', 
                           'successful_runs', 'failed_runs', 'is_running']
    
    def get_average_size(self, obj):
        if obj.average_size and obj.average_size > 0:
            return humanize.naturalsize(obj.average_size)
        return "N/A"
    
    def get_last_run_humanized(self, obj):
        if obj.last_run:
            return humanize.naturaltime(timezone.now() - obj.last_run)
        return "Never"
    
    def get_next_run_humanized(self, obj):
        if obj.next_run:
            if obj.next_run < timezone.now():
                return "Overdue"
            return humanize.naturaltime(obj.next_run - timezone.now())
        return "Not scheduled"


class DatabaseBackupSerializer(serializers.ModelSerializer):
    schedule_name = serializers.CharField(source='schedule.name', read_only=True, default="Manual")
    duration_humanized = serializers.SerializerMethodField()
    size_humanized = serializers.SerializerMethodField()
    created_humanized = serializers.SerializerMethodField()
    expires_humanized = serializers.SerializerMethodField()
    created_by_name = serializers.CharField(source='created_by.get_full_name', read_only=True, default="System")
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    backup_type_display = serializers.CharField(source='get_backup_type_display', read_only=True)
    
    class Meta:
        model = DatabaseBackup
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'checksum', 'size_bytes']
    
    def get_duration_humanized(self, obj):
        if obj.started_at and obj.completed_at:
            duration = obj.completed_at - obj.started_at
            total_seconds = duration.total_seconds()
            
            if total_seconds < 60:
                return f"{int(total_seconds)} seconds"
            elif total_seconds < 3600:
                return f"{total_seconds/60:.1f} minutes"
            elif total_seconds < 86400:
                return f"{total_seconds/3600:.1f} hours"
            else:
                return f"{total_seconds/86400:.1f} days"
        return "N/A"
    
    def get_size_humanized(self, obj):
        if obj.size_bytes and obj.size_bytes > 0:
            return humanize.naturalsize(obj.size_bytes)
        elif obj.file_size:
            return obj.file_size
        return "Unknown"
    
    def get_created_humanized(self, obj):
        return humanize.naturaltime(timezone.now() - obj.created_at)
    
    def get_expires_humanized(self, obj):
        if obj.expires_at:
            if obj.expires_at < timezone.now():
                return "Expired"
            return humanize.naturaltime(obj.expires_at - timezone.now())
        return "Never"


class BackupLogSerializer(serializers.ModelSerializer):
    backup_name = serializers.CharField(source='backup.name', read_only=True)
    schedule_name = serializers.CharField(source='schedule.name', read_only=True, default="N/A")
    time_humanized = serializers.SerializerMethodField()
    level_display = serializers.CharField(source='get_level_display', read_only=True)
    
    class Meta:
        model = BackupLog
        fields = '__all__'
    
    def get_time_humanized(self, obj):
        return humanize.naturaltime(timezone.now() - obj.timestamp)


class BackupStatisticsSerializer(serializers.ModelSerializer):
    success_rate = serializers.SerializerMethodField()
    total_size_tb = serializers.SerializerMethodField()
    date_formatted = serializers.SerializerMethodField()
    
    class Meta:
        model = BackupStatistics
        fields = '__all__'
    
    def get_success_rate(self, obj):
        if obj.total_backups > 0:
            return round((obj.successful_backups / obj.total_backups) * 100, 1)
        return 0
    
    def get_total_size_tb(self, obj):
        return round(obj.total_size_gb / 1024, 2) if obj.total_size_gb else 0
    
    def get_date_formatted(self, obj):
        return obj.date.strftime("%Y-%m-%d")


class BackupDestinationSerializer(serializers.ModelSerializer):
    usage_percentage = serializers.SerializerMethodField()
    free_space_humanized = serializers.SerializerMethodField()
    used_space_humanized = serializers.SerializerMethodField()
    total_space_humanized = serializers.SerializerMethodField()
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    type_display = serializers.CharField(source='get_type_display', read_only=True)
    
    class Meta:
        model = BackupDestination
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'updated_at', 'last_checked']
    
    def get_usage_percentage(self, obj):
        if obj.total_space_gb and obj.total_space_gb > 0:
            return round((obj.used_space_gb / obj.total_space_gb) * 100, 1)
        return 0
    
    def get_free_space_humanized(self, obj):
        free = obj.free_space_gb_calculated
        if free is not None:
            return f"{free:.1f} GB"
        return "Unknown"
    
    def get_used_space_humanized(self, obj):
        return f"{obj.used_space_gb:.1f} GB" if obj.used_space_gb else "0 GB"
    
    def get_total_space_humanized(self, obj):
        if obj.total_space_gb:
            return f"{obj.total_space_gb:.1f} GB"
        return "Unknown"


class DashboardStatsSerializer(serializers.Serializer):
    """Serializer for dashboard overview"""
    total_backups = serializers.IntegerField()
    total_size_gb = serializers.FloatField()
    last_backup = serializers.DictField(allow_null=True)
    success_rate = serializers.FloatField()
    
    storage_used_gb = serializers.FloatField()
    storage_total_gb = serializers.FloatField()
    storage_percentage = serializers.FloatField()
    
    active_schedules = serializers.IntegerField()
    paused_schedules = serializers.IntegerField()
    
    backups_by_type = serializers.DictField()
    recent_backups = DatabaseBackupSerializer(many=True)
    upcoming_schedules = BackupScheduleSerializer(many=True)


class CreateBackupSerializer(serializers.Serializer):
    """Serializer for creating a new backup"""
    schedule_id = serializers.UUIDField(required=False, allow_null=True)
    backup_type = serializers.ChoiceField(choices=BackupSchedule.BACKUP_TYPES, default='full')
    description = serializers.CharField(required=False, allow_blank=True, default="")
    destination = serializers.ChoiceField(
        choices=[('local', 'Local'), ('s3', 'AWS S3'), ('both', 'Local + Cloud'), ('cold', 'Cold Storage')], 
        default='local'
    )
    compression = serializers.BooleanField(default=True)
    encryption = serializers.BooleanField(default=True)
    verify = serializers.BooleanField(default=True)


class RestoreBackupSerializer(serializers.Serializer):
    """Serializer for restoring a backup"""
    backup_id = serializers.UUIDField()
    target_database = serializers.CharField(default='default', required=False)
    overwrite = serializers.BooleanField(default=False, required=False)
    verify_before_restore = serializers.BooleanField(default=True, required=False)
    create_backup_before = serializers.BooleanField(default=True, required=False)