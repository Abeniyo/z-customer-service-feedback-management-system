# backup_manager/serializers.py
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
    
    class Meta:
        model = BackupSchedule
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'updated_at', 'total_runs', 
                           'successful_runs', 'failed_runs', 'is_running']
    
    def get_average_size(self, obj):
        if obj.average_size:
            return humanize.naturalsize(obj.average_size)
        return "N/A"
    
    def get_last_run_humanized(self, obj):
        if obj.last_run:
            return humanize.naturaltime(timezone.now() - obj.last_run)
        return "Never"
    
    def get_next_run_humanized(self, obj):
        if obj.next_run:
            return humanize.naturaltime(obj.next_run - timezone.now())
        return "Not scheduled"


class DatabaseBackupSerializer(serializers.ModelSerializer):
    schedule_name = serializers.CharField(source='schedule.name', read_only=True)
    duration_humanized = serializers.SerializerMethodField()
    size_humanized = serializers.SerializerMethodField()
    created_humanized = serializers.SerializerMethodField()
    expires_humanized = serializers.SerializerMethodField()
    created_by_name = serializers.CharField(source='created_by.get_full_name', read_only=True)
    
    class Meta:
        model = DatabaseBackup
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'checksum', 'size_bytes']
    
    def get_duration_humanized(self, obj):
        return humanize.naturaldelta(timedelta(seconds=obj.duration))
    
    def get_size_humanized(self, obj):
        if obj.size_bytes:
            return humanize.naturalsize(obj.size_bytes)
        return obj.file_size
    
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
    schedule_name = serializers.CharField(source='schedule.name', read_only=True)
    time_humanized = serializers.SerializerMethodField()
    
    class Meta:
        model = BackupLog
        fields = '__all__'
    
    def get_time_humanized(self, obj):
        return humanize.naturaltime(timezone.now() - obj.timestamp)


class BackupStatisticsSerializer(serializers.ModelSerializer):
    success_rate = serializers.SerializerMethodField()
    total_size_tb = serializers.SerializerMethodField()
    
    class Meta:
        model = BackupStatistics
        fields = '__all__'
    
    def get_success_rate(self, obj):
        if obj.total_backups > 0:
            return (obj.successful_backups / obj.total_backups) * 100
        return 0
    
    def get_total_size_tb(self, obj):
        return obj.total_size_gb / 1024 if obj.total_size_gb else 0


class BackupDestinationSerializer(serializers.ModelSerializer):
    usage_percentage = serializers.FloatField(read_only=True)
    free_space_humanized = serializers.SerializerMethodField()
    used_space_humanized = serializers.SerializerMethodField()
    total_space_humanized = serializers.SerializerMethodField()
    
    class Meta:
        model = BackupDestination
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'updated_at', 'last_checked']
    
    def get_free_space_humanized(self, obj):
        if obj.free_space_gb:
            return f"{obj.free_space_gb:.1f} GB"
        return "Unknown"
    
    def get_used_space_humanized(self, obj):
        return f"{obj.used_space_gb:.1f} GB"
    
    def get_total_space_humanized(self, obj):
        if obj.total_space_gb:
            return f"{obj.total_space_gb:.1f} GB"
        return "Unknown"


class DashboardStatsSerializer(serializers.Serializer):
    """Serializer for dashboard overview"""
    total_backups = serializers.IntegerField()
    total_size_gb = serializers.FloatField()
    last_backup = serializers.DictField()
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
    schedule_id = serializers.UUIDField(required=False)
    backup_type = serializers.ChoiceField(choices=BackupSchedule.BACKUP_TYPES, default='full')
    description = serializers.CharField(required=False, allow_blank=True)
    destination = serializers.ChoiceField(choices=BackupSchedule.DESTINATION_TYPES, default='local')
    compression = serializers.BooleanField(default=True)
    encryption = serializers.BooleanField(default=True)
    verify = serializers.BooleanField(default=True)


class RestoreBackupSerializer(serializers.Serializer):
    """Serializer for restoring a backup"""
    backup_id = serializers.UUIDField()
    target_database = serializers.CharField(default='default')
    overwrite = serializers.BooleanField(default=False)
    verify_before_restore = serializers.BooleanField(default=True)
    create_backup_before = serializers.BooleanField(default=True)