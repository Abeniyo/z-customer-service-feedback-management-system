from django.shortcuts import render
from rest_framework import viewsets, status, generics
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.permissions import IsAdminUser
from rest_framework.response import Response
from rest_framework.views import APIView
from django.db.models import Count, Q, Avg
from django.utils import timezone
from datetime import timedelta
import psutil
import json

from .models import SystemMetrics, SecurityEvent, SystemError
from .serializers import (
    SystemMetricsSerializer, SecurityEventSerializer, SystemErrorSerializer,
    DashboardOverviewSerializer, RateLimitStatsSerializer, BruteForceStatsSerializer,
    AccessAttemptSerializer, AuditLogSerializer, HoneypotLogSerializer
)
from axes.models import AccessAttempt
from axes.utils import get_client_ip_address
from auditlog.models import LogEntry
from .models import HoneypotLog

class IsSystemAdmin(IsAdminUser):
    """Custom permission for system admins only"""
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_staff)

class SystemMetricsViewSet(viewsets.ReadOnlyModelViewSet):
    """API endpoint for system metrics"""
    queryset = SystemMetrics.objects.all()
    serializer_class = SystemMetricsSerializer
    #permission_classes = [IsSystemAdmin]
    
    @action(detail=False, methods=['get'])
    def current(self, request):
        """Get current system metrics in real-time"""
        try:
            # Get real system metrics using psutil
            cpu_percent = psutil.cpu_percent(interval=1)
            memory = psutil.virtual_memory()
            disk = psutil.disk_usage('/')
            network = psutil.net_io_counters()
            
            # Save to database
            metrics = SystemMetrics.objects.create(
                cpu_usage=cpu_percent,
                cpu_temperature=self._get_cpu_temp(),
                memory_used=memory.used / (1024**3),  # Convert to GB
                memory_total=memory.total / (1024**3),
                disk_used=disk.used / (1024**3),
                disk_total=disk.total / (1024**3),
                network_incoming=network.bytes_recv / (1024**2),  # MB
                network_outgoing=network.bytes_sent / (1024**2),
                active_connections=len(psutil.net_connections()),
                database_connections=self._get_db_connections()
            )
            
            return Response(SystemMetricsSerializer(metrics).data)
        except Exception as e:
            return Response({'error': str(e)}, status=500)
    
    def _get_cpu_temp(self):
        """Get CPU temperature if available"""
        try:
            temps = psutil.sensors_temperatures()
            if 'coretemp' in temps:
                return temps['coretemp'][0].current
        except:
            pass
        return None
    
    def _get_db_connections(self):
        """Get database connection count"""
        from django.db import connection
        with connection.cursor() as cursor:
            cursor.execute("SELECT count(*) FROM pg_stat_activity;")
            return cursor.fetchone()[0]

class SecurityEventViewSet(viewsets.ModelViewSet):
    """API endpoint for security events"""
    queryset = SecurityEvent.objects.all()
    serializer_class = SecurityEventSerializer
    #permission_classes = [IsSystemAdmin]
    filterset_fields = ['event_type', 'severity', 'status', 'source_ip']
    search_fields = ['source_ip', 'target', 'details']
    
    @action(detail=True, methods=['post'])
    def block_ip(self, request, pk=None):
        """Block IP permanently"""
        event = self.get_object()
        # Add to axes blacklist or custom blocklist
        # Implement IP blocking logic here
        return Response({'status': 'ip blocked'})
    
    @action(detail=False, methods=['get'])
    def stats(self, request):
        """Get security statistics"""
        time_range = request.query_params.get('range', '24h')
        hours = int(time_range.replace('h', '')) if 'h' in time_range else 24
        
        since = timezone.now() - timedelta(hours=hours)
        events = SecurityEvent.objects.filter(timestamp__gte=since)
        
        # Rate limit stats
        rate_limited = events.filter(event_type='rate_limit')
        rate_limit_stats = {
            'total': rate_limited.count(),
            'blocked': rate_limited.filter(status='blocked').count(),
            'limited': rate_limited.filter(status='limited').count(),
            'current': events.filter(event_type='rate_limit', status='limited').count(),
            'top_endpoints': list(
                rate_limited.values('endpoint')
                .annotate(count=Count('id'), blocked=Count('id', filter=Q(status='blocked')))
                .order_by('-count')[:5]
            ),
            'top_ips': list(
                rate_limited.values('source_ip')
                .annotate(count=Count('id'), blocked=Count('id', filter=Q(status='blocked')))
                .order_by('-count')[:5]
            )
        }
        
        # Brute force stats
        brute_force = events.filter(event_type='brute_force')
        brute_force_stats = {
            'total': brute_force.count(),
            'blocked': brute_force.filter(status='blocked').count(),
            'monitored': brute_force.filter(status='monitoring').count(),
            'average_attempts': brute_force.aggregate(Avg('attempts'))['attempts__avg'] or 0,
            'top_targets': list(
                brute_force.values('target')
                .annotate(attempts=Avg('attempts'), blocked=Count('id', filter=Q(status='blocked')))
                .order_by('-attempts')[:5]
            ),
            'by_country': list(
                brute_force.values('country')
                .annotate(count=Count('id'))
                .order_by('-count')[:5]
            )
        }
        
        return Response({
            'rate_limit': rate_limit_stats,
            'brute_force': brute_force_stats
        })

class SystemErrorViewSet(viewsets.ReadOnlyModelViewSet):
    """API endpoint for system errors"""
    queryset = SystemError.objects.all()
    serializer_class = SystemErrorSerializer
    #permission_classes = [IsSystemAdmin]
    filterset_fields = ['error_type', 'severity', 'status']

class DashboardOverviewAPIView(APIView):
    """Combined dashboard overview"""
    #permission_classes = [IsSystemAdmin]
    
    def get(self, request):
        time_range = request.query_params.get('range', '24h')
        hours = int(time_range.replace('h', '')) if 'h' in time_range else 24
        since = timezone.now() - timedelta(hours=hours)
        
        # Get latest system metrics
        latest_metrics = SystemMetrics.objects.first()
        
        # Get security events count
        security_events = SecurityEvent.objects.filter(timestamp__gte=since)
        
        # Calculate system health
        if latest_metrics:
            cpu_status = 'healthy' if latest_metrics.cpu_usage < 70 else 'warning' if latest_metrics.cpu_usage < 90 else 'critical'
            memory_percent = (latest_metrics.memory_used / latest_metrics.memory_total) * 100
            memory_status = 'healthy' if memory_percent < 70 else 'warning' if memory_percent < 90 else 'critical'
            disk_percent = (latest_metrics.disk_used / latest_metrics.disk_total) * 100
            disk_status = 'healthy' if disk_percent < 60 else 'warning' if disk_percent < 85 else 'critical'
            
            data = {
                'cpu': {
                    'usage': latest_metrics.cpu_usage,
                    'cores': psutil.cpu_count(),
                    'temperature': latest_metrics.cpu_temperature,
                    'loadAverage': psutil.getloadavg() if hasattr(psutil, 'getloadavg') else [0, 0, 0],
                    'status': cpu_status
                },
                'memory': {
                    'total': round(latest_metrics.memory_total, 1),
                    'used': round(latest_metrics.memory_used, 1),
                    'free': round(latest_metrics.memory_total - latest_metrics.memory_used, 1),
                    'percentage': round(memory_percent, 1),
                    'status': memory_status
                },
                'disk': {
                    'total': round(latest_metrics.disk_total, 1),
                    'used': round(latest_metrics.disk_used, 1),
                    'free': round(latest_metrics.disk_total - latest_metrics.disk_used, 1),
                    'percentage': round(disk_percent, 1),
                    'status': disk_status,
                    'warning': 'Disk usage above 60%' if disk_percent > 60 else None
                },
                'network': {
                    'incoming': round(latest_metrics.network_incoming, 1),
                    'outgoing': round(latest_metrics.network_outgoing, 1),
                    'connections': latest_metrics.active_connections,
                    'latency': 23,  # You'd need to calculate this
                    'status': 'healthy'
                },
                'database': {
                    'connections': latest_metrics.database_connections,
                    'activeQueries': 12,  # You'd need to query this
                    'slowQueries': 3,      # You'd need to query this
                    'replicationLag': 0.5,  # You'd need to query this
                    'status': 'healthy'
                },
                'security': {
                    'active': security_events.count(),
                    'brute_force': security_events.filter(event_type='brute_force').count(),
                    'rate_limited': security_events.filter(event_type='rate_limit').count(),
                    'blocked_ips': security_events.filter(status='blocked').count(),
                    'critical': security_events.filter(severity='critical').count()
                }
            }
            return Response(data)
        return Response({'error': 'No metrics available'}, status=404)

# Axes Integration View
class AxesAccessAttemptViewSet(viewsets.ReadOnlyModelViewSet):
    """View access attempts from django-axes"""
    queryset = AccessAttempt.objects.all().order_by('-attempt_time')
    serializer_class = AccessAttemptSerializer
    #permission_classes = [IsSystemAdmin]
    filterset_fields = ['username', 'ip_address']
    
    @action(detail=False, methods=['post'])
    def clear_blocked(self, request):
        """Clear all blocked attempts"""
        # Implement clearing logic
        return Response({'status': 'cleared'})

# AuditLog Integration View
class AuditLogViewSet(viewsets.ReadOnlyModelViewSet):
    """View audit logs"""
    queryset = LogEntry.objects.all().order_by('-timestamp')
    serializer_class = AuditLogSerializer
    #permission_classes = [IsSystemAdmin]
    filterset_fields = ['action', 'content_type']
    search_fields = ['object_repr', 'changes']

# Honeypot Integration View
class HoneypotLogViewSet(viewsets.ReadOnlyModelViewSet):
    """View honeypot triggers"""
    queryset = HoneypotLog.objects.all().order_by('-timestamp')
    serializer_class = HoneypotLogSerializer
    #permission_classes = [IsSystemAdmin]

# Real-time stats endpoint for the dashboard
@api_view(['GET'])
#@permission_classes([IsSystemAdmin])
def realtime_stats(request):
    """Get real-time statistics for dashboard updates"""
    # Get latest security events
    recent_events = SecurityEvent.objects.filter(
        timestamp__gte=timezone.now() - timedelta(minutes=5)
    )[:10]
    
    # Get system errors
    active_errors = SystemError.objects.filter(status='monitoring')[:10]
    
    return Response({
        'events': SecurityEventSerializer(recent_events, many=True).data,
        'errors': SystemErrorSerializer(active_errors, many=True).data,
        'timestamp': timezone.now()
    })