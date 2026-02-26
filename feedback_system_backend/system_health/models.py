from django.db import models
from django.contrib.auth import get_user_model
from django.utils import timezone
import psutil
import json

User = get_user_model()

class SystemMetrics(models.Model):
    """Store system health metrics over time"""
    timestamp = models.DateTimeField(auto_now_add=True)
    cpu_usage = models.FloatField()
    cpu_temperature = models.FloatField(null=True, blank=True)
    memory_used = models.FloatField()  # in GB
    memory_total = models.FloatField()  # in GB
    disk_used = models.FloatField()  # in GB
    disk_total = models.FloatField()  # in GB
    network_incoming = models.FloatField()  # Mbps
    network_outgoing = models.FloatField()  # Mbps
    active_connections = models.IntegerField()
    database_connections = models.IntegerField()
    
    class Meta:
        ordering = ['-timestamp']
        
    def to_dict(self):
        return {
            'timestamp': self.timestamp,
            'cpu': {
                'usage': self.cpu_usage,
                'temperature': self.cpu_temperature,
            },
            'memory': {
                'used': self.memory_used,
                'total': self.memory_total,
                'percentage': (self.memory_used / self.memory_total) * 100
            },
            'disk': {
                'used': self.disk_used,
                'total': self.disk_total,
                'percentage': (self.disk_used / self.disk_total) * 100
            },
            'network': {
                'incoming': self.network_incoming,
                'outgoing': self.network_outgoing,
                'connections': self.active_connections
            }
        }

class SecurityEvent(models.Model):
    """Track security events from axes and honeyguard"""
    EVENT_TYPES = [
        ('brute_force', 'Brute Force Attempt'),
        ('rate_limit', 'Rate Limit Exceeded'),
        ('honeypot', 'Honeypot Triggered'),
        ('suspicious', 'Suspicious Activity'),
    ]
    
    SEVERITY_LEVELS = [
        ('critical', 'Critical'),
        ('high', 'High'),
        ('medium', 'Medium'),
        ('low', 'Low'),
    ]
    
    STATUS_CHOICES = [
        ('blocked', 'Blocked'),
        ('limited', 'Rate Limited'),
        ('monitoring', 'Under Monitoring'),
        ('resolved', 'Resolved'),
    ]
    
    timestamp = models.DateTimeField(auto_now_add=True)
    event_type = models.CharField(max_length=20, choices=EVENT_TYPES)
    severity = models.CharField(max_length=10, choices=SEVERITY_LEVELS)
    source_ip = models.GenericIPAddressField()
    target = models.CharField(max_length=255)
    endpoint = models.CharField(max_length=255)
    attempts = models.IntegerField(default=1)
    user_agent = models.TextField(blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES)
    action_taken = models.CharField(max_length=100)
    details = models.TextField()
    country = models.CharField(max_length=100, blank=True)
    isp = models.CharField(max_length=200, blank=True)
    metadata = models.JSONField(default=dict, blank=True)
    
    class Meta:
        ordering = ['-timestamp']
        
    def __str__(self):
        return f"{self.event_type} - {self.source_ip} - {self.timestamp}"

class SystemError(models.Model):
    """Track system errors and warnings"""
    ERROR_TYPES = [
        ('database', 'Database Error'),
        ('api', 'API Error'),
        ('network', 'Network Issue'),
        ('security', 'Security Alert'),
        ('application', 'Application Error'),
        ('cache', 'Cache Error'),
    ]
    
    timestamp = models.DateTimeField(auto_now_add=True)
    error_type = models.CharField(max_length=20, choices=ERROR_TYPES)
    severity = models.CharField(max_length=10, choices=SecurityEvent.SEVERITY_LEVELS)
    source = models.CharField(max_length=100)
    message = models.CharField(max_length=255)
    details = models.TextField()
    status = models.CharField(max_length=20, choices=SecurityEvent.STATUS_CHOICES)
    resolved_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        ordering = ['-timestamp']
        
    @property
    def duration(self):
        if self.resolved_at:
            delta = self.resolved_at - self.timestamp
            minutes = delta.total_seconds() / 60
            if minutes < 1:
                return f"{delta.total_seconds():.0f}s"
            elif minutes < 60:
                return f"{minutes:.1f}m"
            else:
                return f"{minutes/60:.1f}h"
        return None



class HoneypotLog(models.Model):
    ip_address = models.GenericIPAddressField()
    user_agent = models.TextField(blank=True, null=True)
    path = models.CharField(max_length=255)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.ip_address} - {self.path}"