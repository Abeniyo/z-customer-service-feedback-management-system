from rest_framework import serializers
from .models import SystemMetrics, SecurityEvent, SystemError, HoneypotLog
from axes.models import AccessAttempt
from auditlog.models import LogEntry
# from django_honeyguard.models import HoneypotLog
from django.contrib.auth import get_user_model

User = get_user_model()

class SystemMetricsSerializer(serializers.ModelSerializer):
    class Meta:
        model = SystemMetrics
        fields = '__all__'

class SecurityEventSerializer(serializers.ModelSerializer):
    class Meta:
        model = SecurityEvent
        fields = '__all__'

class SystemErrorSerializer(serializers.ModelSerializer):
    duration = serializers.SerializerMethodField()
    
    class Meta:
        model = SystemError
        fields = '__all__'
    
    def get_duration(self, obj):
        return obj.duration

class DashboardOverviewSerializer(serializers.Serializer):
    """Combined dashboard overview data"""
    cpu = serializers.DictField()
    memory = serializers.DictField()
    disk = serializers.DictField()
    network = serializers.DictField()
    database = serializers.DictField()
    security = serializers.DictField()

class RateLimitStatsSerializer(serializers.Serializer):
    total = serializers.IntegerField()
    blocked = serializers.IntegerField()
    limited = serializers.IntegerField()
    current = serializers.IntegerField()
    top_endpoints = serializers.ListField()
    top_ips = serializers.ListField()

class BruteForceStatsSerializer(serializers.Serializer):
    total = serializers.IntegerField()
    blocked = serializers.IntegerField()
    monitored = serializers.IntegerField()
    average_attempts = serializers.FloatField()
    top_targets = serializers.ListField()
    by_country = serializers.ListField()

# Axes Integration Serializer
class AccessAttemptSerializer(serializers.ModelSerializer):
    # Use SerializerMethodField for methods
    username = serializers.SerializerMethodField()
    # Or if you want to keep the name get_username:
    # get_username = serializers.SerializerMethodField()
    
    class Meta:
        model = AccessAttempt
        fields = [
            'id', 
            'username',  # or 'get_username' if you prefer
            'ip_address', 
            'attempt_time', 
            'failures_since_start',
            'user_agent',
            'path_info',
        ]
    
    def get_username(self, obj):
        """Get username from the attempt"""
        return obj.username
# AuditLog Serializer
class AuditLogSerializer(serializers.ModelSerializer):
    actor_email = serializers.EmailField(source='actor.email', read_only=True)
    content_type_name = serializers.CharField(source='content_type.model', read_only=True)
    
    class Meta:
        model = LogEntry
        fields = ['id', 'timestamp', 'actor', 'actor_email', 'action', 'content_type', 
                  'content_type_name', 'object_pk', 'changes', 'changes_dict']

# Honeypot Log Serializer
class HoneypotLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = HoneypotLog
        fields = '__all__'