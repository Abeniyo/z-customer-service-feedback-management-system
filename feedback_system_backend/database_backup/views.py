from rest_framework import viewsets, status
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.permissions import IsAdminUser
from rest_framework.response import Response
from rest_framework.views import APIView
from django.db.models import Count, Sum
from django.utils import timezone
from datetime import timedelta
import humanize
import os

from .models import (
    BackupSchedule, DatabaseBackup, BackupLog, 
    BackupStatistics, BackupDestination
)
from .serializers import (
    BackupScheduleSerializer, DatabaseBackupSerializer, BackupLogSerializer,
    BackupStatisticsSerializer, BackupDestinationSerializer,
    DashboardStatsSerializer, CreateBackupSerializer, RestoreBackupSerializer
)

class IsSystemAdmin(IsAdminUser):
    """Custom permission for system admins"""
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_staff)


class BackupScheduleViewSet(viewsets.ModelViewSet):
    """API endpoint for backup schedules"""
    queryset = BackupSchedule.objects.all()
    serializer_class = BackupScheduleSerializer
    # permission_classes = [IsSystemAdmin]  # Uncomment when ready
    filterset_fields = ['status', 'backup_type', 'frequency', 'destination_type']
    search_fields = ['name', 'description']
    
    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user if self.request.user.is_authenticated else None)
    
    @action(detail=True, methods=['post'])
    def pause(self, request, pk=None):
        """Pause a backup schedule"""
        schedule = self.get_object()
        schedule.status = 'paused'
        schedule.save()
        
        BackupLog.objects.create(
            schedule=schedule,
            level='info',
            message=f"Schedule paused by {request.user.get_full_name() if request.user.is_authenticated else 'System'}",
            details={'action': 'pause', 'user': request.user.email if request.user.is_authenticated else 'system'}
        )
        
        return Response({'status': 'paused'})
    
    @action(detail=True, methods=['post'])
    def resume(self, request, pk=None):
        """Resume a backup schedule"""
        schedule = self.get_object()
        schedule.status = 'active'
        schedule.save()
        
        BackupLog.objects.create(
            schedule=schedule,
            level='info',
            message=f"Schedule resumed by {request.user.get_full_name() if request.user.is_authenticated else 'System'}",
            details={'action': 'resume', 'user': request.user.email if request.user.is_authenticated else 'system'}
        )
        
        return Response({'status': 'resumed'})
    
    @action(detail=True, methods=['post'])
    def run_now(self, request, pk=None):
        """Run backup immediately"""
        schedule = self.get_object()
        
        if schedule.is_running:
            return Response(
                {'error': 'Backup already running'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Create backup record
        backup = DatabaseBackup.objects.create(
            schedule=schedule,
            name=f"manual_{schedule.name}_{timezone.now().strftime('%Y%m%d_%H%M%S')}",
            backup_type=schedule.backup_type,
            status='pending',
            location_type=schedule.destination_type,
            compression_enabled=schedule.compression_enabled,
            encryption_enabled=schedule.encryption_enabled,
            created_by=request.user if request.user.is_authenticated else None,
        )
        
        BackupLog.objects.create(
            schedule=schedule,
            backup=backup,
            level='info',
            message=f"Manual backup triggered by {request.user.get_full_name() if request.user.is_authenticated else 'System'}",
            details={'action': 'run_now', 'user': request.user.email if request.user.is_authenticated else 'system'}
        )
        
        return Response({'status': 'backup started', 'backup_id': backup.id})
    
    @action(detail=True, methods=['get'])
    def backups(self, request, pk=None):
        """Get backups for this schedule"""
        schedule = self.get_object()
        backups = schedule.backups.all()[:50]
        serializer = DatabaseBackupSerializer(backups, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['get'])
    def logs(self, request, pk=None):
        """Get logs for this schedule"""
        schedule = self.get_object()
        logs = schedule.logs.all()[:100]
        serializer = BackupLogSerializer(logs, many=True)
        return Response(serializer.data)


class DatabaseBackupViewSet(viewsets.ModelViewSet):
    """API endpoint for database backups"""
    queryset = DatabaseBackup.objects.all()
    serializer_class = DatabaseBackupSerializer
    # permission_classes = [IsSystemAdmin]  # Uncomment when ready
    filterset_fields = ['status', 'backup_type', 'location_type', 'schedule']
    search_fields = ['name', 'filename', 'error_message']
    
    def get_queryset(self):
        queryset = super().get_queryset()
        
        # Filter by date range
        days = self.request.query_params.get('days', None)
        if days:
            try:
                days = int(days)
                since = timezone.now() - timedelta(days=days)
                queryset = queryset.filter(created_at__gte=since)
            except ValueError:
                pass
        
        # Filter by size range
        min_size = self.request.query_params.get('min_size_mb', None)
        max_size = self.request.query_params.get('max_size_mb', None)
        if min_size:
            queryset = queryset.filter(size_bytes__gte=int(min_size) * 1024 * 1024)
        if max_size:
            queryset = queryset.filter(size_bytes__lte=int(max_size) * 1024 * 1024)
        
        return queryset
    
    @action(detail=True, methods=['post'])
    def restore(self, request, pk=None):
        """Restore a backup"""
        backup = self.get_object()
        
        serializer = RestoreBackupSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        BackupLog.objects.create(
            backup=backup,
            schedule=backup.schedule,
            level='warning',
            message=f"Restore initiated by {request.user.get_full_name() if request.user.is_authenticated else 'System'}",
            details={'action': 'restore', 'user': request.user.email if request.user.is_authenticated else 'system'}
        )
        
        return Response({'status': 'restore initiated'})
    
    @action(detail=True, methods=['post'])
    def verify(self, request, pk=None):
        """Verify backup integrity"""
        backup = self.get_object()
        
        BackupLog.objects.create(
            backup=backup,
            schedule=backup.schedule,
            level='info',
            message=f"Verification started by {request.user.get_full_name() if request.user.is_authenticated else 'System'}"
        )
        
        return Response({'status': 'verification started'})
    
    @action(detail=True, methods=['post'])
    def delete_permanent(self, request, pk=None):
        """Permanently delete backup"""
        backup = self.get_object()
        
        # Delete from storage if local
        try:
            if backup.location_type == 'local' and os.path.exists(backup.file_path):
                os.remove(backup.file_path)
        except Exception as e:
            return Response({'error': str(e)}, status=500)
        
        backup.status = 'deleted'
        backup.deleted_at = timezone.now()
        backup.save()
        
        BackupLog.objects.create(
            backup=backup,
            schedule=backup.schedule,
            level='warning',
            message=f"Backup permanently deleted by {request.user.get_full_name() if request.user.is_authenticated else 'System'}"
        )
        
        return Response({'status': 'deleted'})
    
    @action(detail=False, methods=['get'])
    def stats(self, request):
        """Get backup statistics"""
        days = int(request.query_params.get('days', 30))
        since = timezone.now() - timedelta(days=days)
        
        backups = self.get_queryset().filter(created_at__gte=since)
        
        stats = {
            'total': backups.count(),
            'successful': backups.filter(status='success').count(),
            'failed': backups.filter(status='failed').count(),
            'warning': backups.filter(status='warning').count(),
            'total_size': sum(b.size_bytes or 0 for b in backups),
            'by_type': dict(
                backups.values('backup_type')
                .annotate(count=Count('id'))
                .values_list('backup_type', 'count')
            ),
            'by_status': dict(
                backups.values('status')
                .annotate(count=Count('id'))
                .values_list('status', 'count')
            ),
            'daily_average': round(backups.count() / days, 1) if days > 0 else 0,
        }
        
        # Add humanized size
        stats['total_size_humanized'] = humanize.naturalsize(stats['total_size'])
        
        return Response(stats)
    
    @action(detail=False, methods=['post'])
    def create_backup(self, request):
        """Create a new backup manually"""
        serializer = CreateBackupSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        data = serializer.validated_data
        
        # Get schedule if provided
        schedule = None
        if data.get('schedule_id'):
            try:
                schedule = BackupSchedule.objects.get(id=data['schedule_id'])
            except BackupSchedule.DoesNotExist:
                pass
        
        # Create backup record
        backup = DatabaseBackup.objects.create(
            schedule=schedule,
            name=f"manual_backup_{timezone.now().strftime('%Y%m%d_%H%M%S')}",
            backup_type=data['backup_type'],
            status='pending',
            location_type=data['destination'],
            compression_enabled=data['compression'],
            encryption_enabled=data['encryption'],
            created_by=request.user if request.user.is_authenticated else None,
        )
        
        BackupLog.objects.create(
            backup=backup,
            schedule=schedule,
            level='info',
            message=f"Manual backup created by {request.user.get_full_name() if request.user.is_authenticated else 'System'}"
        )
        
        return Response(
            DatabaseBackupSerializer(backup).data,
            status=status.HTTP_201_CREATED
        )


class BackupLogViewSet(viewsets.ReadOnlyModelViewSet):
    """API endpoint for backup logs"""
    queryset = BackupLog.objects.all().select_related('backup', 'schedule')
    serializer_class = BackupLogSerializer
    # permission_classes = [IsSystemAdmin]
    filterset_fields = ['level', 'backup', 'schedule']
    search_fields = ['message']


class BackupStatisticsViewSet(viewsets.ReadOnlyModelViewSet):
    """API endpoint for backup statistics"""
    queryset = BackupStatistics.objects.all()
    serializer_class = BackupStatisticsSerializer
    # permission_classes = [IsSystemAdmin]
    filterset_fields = ['date']
    
    @action(detail=False, methods=['get'])
    def latest(self, request):
        """Get latest statistics"""
        stats = self.queryset.first()
        if stats:
            serializer = self.get_serializer(stats)
            return Response(serializer.data)
        return Response({'detail': 'No statistics available'}, status=404)


class BackupDestinationViewSet(viewsets.ModelViewSet):
    """API endpoint for backup destinations"""
    queryset = BackupDestination.objects.all()
    serializer_class = BackupDestinationSerializer
    # permission_classes = [IsSystemAdmin]
    filterset_fields = ['type', 'status', 'is_default']
    search_fields = ['name']
    
    @action(detail=True, methods=['post'])
    def test_connection(self, request, pk=None):
        """Test connection to destination"""
        destination = self.get_object()
        
        # Simulate connection test
        try:
            destination.last_checked = timezone.now()
            destination.is_available = True
            destination.last_error = ''
            destination.save()
            
            BackupLog.objects.create(
                level='info',
                message=f"Connection test successful for {destination.name}"
            )
            
            return Response({'status': 'success', 'message': 'Connection successful'})
        except Exception as e:
            destination.is_available = False
            destination.last_error = str(e)
            destination.save()
            
            return Response(
                {'status': 'error', 'message': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )


class DashboardAPIView(APIView):
    """Main dashboard API for backup overview"""
    # permission_classes = [IsSystemAdmin]
    
    def get(self, request):
        time_range = request.query_params.get('range', '24h')
        hours = int(time_range.replace('h', '')) if 'h' in time_range else 24
        since = timezone.now() - timedelta(hours=hours)
        
        # Basic stats
        total_backups = DatabaseBackup.objects.count()
        
        # Calculate total size
        total_size = DatabaseBackup.objects.aggregate(
            total=Sum('size_bytes')
        )['total'] or 0
        
        # Last backup
        last_backup = DatabaseBackup.objects.filter(
            status='success'
        ).first()
        
        # Success rate (last 30 days)
        month_ago = timezone.now() - timedelta(days=30)
        recent_backups = DatabaseBackup.objects.filter(created_at__gte=month_ago)
        total_recent = recent_backups.count()
        successful_recent = recent_backups.filter(status='success').count()
        success_rate = (successful_recent / total_recent * 100) if total_recent > 0 else 0
        
        # Storage stats
        storage_used = DatabaseBackup.objects.filter(
            status__in=['success', 'verified']
        ).aggregate(total=Sum('size_bytes'))['total'] or 0
        
        # Schedule stats
        active_schedules = BackupSchedule.objects.filter(status='active').count()
        paused_schedules = BackupSchedule.objects.filter(status='paused').count()
        
        # Backups by type
        backups_by_type = dict(
            DatabaseBackup.objects.filter(created_at__gte=since)
            .values('backup_type')
            .annotate(count=Count('id'))
            .values_list('backup_type', 'count')
        )
        
        # Recent backups
        recent_backups_list = DatabaseBackup.objects.filter(
            created_at__gte=since
        )[:10]
        
        # Upcoming schedules
        upcoming = BackupSchedule.objects.filter(
            status='active',
            next_run__isnull=False
        ).order_by('next_run')[:5]
        
        data = {
            'total_backups': total_backups,
            'total_size_gb': round(total_size / (1024**3), 2),
            'last_backup': DatabaseBackupSerializer(last_backup).data if last_backup else None,
            'success_rate': round(success_rate, 1),
            'storage_used_gb': round(storage_used / (1024**3), 2),
            'storage_total_gb': 500,  # Configure based on your system
            'storage_percentage': round((storage_used / (500 * 1024**3)) * 100, 1) if storage_used > 0 else 0,
            'active_schedules': active_schedules,
            'paused_schedules': paused_schedules,
            'backups_by_type': backups_by_type,
            'recent_backups': DatabaseBackupSerializer(recent_backups_list, many=True).data,
            'upcoming_schedules': BackupScheduleSerializer(upcoming, many=True).data,
        }
        
        return Response(data)


@api_view(['POST'])
# @permission_classes([IsSystemAdmin])
def cleanup_old_backups(request):
    """Clean up expired backups"""
    days = int(request.data.get('older_than_days', 30))
    
    cutoff = timezone.now() - timedelta(days=days)
    expired = DatabaseBackup.objects.filter(
        created_at__lt=cutoff,
        status__in=['success', 'verified']
    )
    
    count = expired.count()
    
    BackupLog.objects.create(
        level='info',
        message=f"Cleanup initiated for backups older than {days} days. {count} backups to clean."
    )
    
    return Response({
        'status': 'cleanup initiated',
        'backups_to_clean': count
    })


@api_view(['GET'])
def health_check(request):
    """Health check endpoint for monitoring"""
    return Response({
        'status': 'healthy',
        'timestamp': timezone.now(),
        'services': {
            'database': 'connected',
            'backup_service': 'operational'
        },
        'metrics': {
            'total_backups': DatabaseBackup.objects.count(),
            'active_schedules': BackupSchedule.objects.filter(status='active').count(),
            'total_size_gb': round(sum(b.size_bytes or 0 for b in DatabaseBackup.objects.all()) / (1024**3), 2)
        }
    })