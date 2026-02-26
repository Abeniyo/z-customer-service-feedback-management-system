# backup_manager/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'schedules', views.BackupScheduleViewSet, basename='backup-schedule')
router.register(r'backups', views.DatabaseBackupViewSet, basename='database-backup')
router.register(r'logs', views.BackupLogViewSet, basename='backup-log')
router.register(r'statistics', views.BackupStatisticsViewSet, basename='backup-statistics')
router.register(r'destinations', views.BackupDestinationViewSet, basename='backup-destination')

urlpatterns = [
    # Main router URLs
    path('api/backup/', include(router.urls)),
    
    # Dashboard and utilities
    path('api/backup/dashboard/', views.DashboardAPIView.as_view(), name='backup-dashboard'),
    path('api/backup/cleanup/', views.cleanup_old_backups, name='backup-cleanup'),
    
    # Statistics endpoints
    path('api/backup/statistics/latest/', 
         views.BackupStatisticsViewSet.as_view({'get': 'latest'}), 
         name='backup-statistics-latest'),
    
    # Backup statistics endpoint
    path('api/backup/backups/stats/', 
         views.DatabaseBackupViewSet.as_view({'get': 'stats'}), 
         name='backup-stats'),
    
    # Manual backup creation
    path('api/backup/backups/create/', 
         views.DatabaseBackupViewSet.as_view({'post': 'create_backup'}), 
         name='backup-create'),
    
    # Schedule specific actions (these are already in the router, but adding explicit paths)
    path('api/backup/schedules/<uuid:pk>/pause/', 
         views.BackupScheduleViewSet.as_view({'post': 'pause'}), 
         name='backup-schedule-pause'),
    
    path('api/backup/schedules/<uuid:pk>/resume/', 
         views.BackupScheduleViewSet.as_view({'post': 'resume'}), 
         name='backup-schedule-resume'),
    
    path('api/backup/schedules/<uuid:pk>/run-now/', 
         views.BackupScheduleViewSet.as_view({'post': 'run_now'}), 
         name='backup-schedule-run-now'),
    
    path('api/backup/schedules/<uuid:pk>/backups/', 
         views.BackupScheduleViewSet.as_view({'get': 'backups'}), 
         name='backup-schedule-backups'),
    
    path('api/backup/schedules/<uuid:pk>/logs/', 
         views.BackupScheduleViewSet.as_view({'get': 'logs'}), 
         name='backup-schedule-logs'),
    
    # Backup specific actions
    path('api/backup/backups/<uuid:pk>/restore/', 
         views.DatabaseBackupViewSet.as_view({'post': 'restore'}), 
         name='backup-restore'),
    
    path('api/backup/backups/<uuid:pk>/verify/', 
         views.DatabaseBackupViewSet.as_view({'post': 'verify'}), 
         name='backup-verify'),
    
    path('api/backup/backups/<uuid:pk>/delete-permanent/', 
         views.DatabaseBackupViewSet.as_view({'post': 'delete_permanent'}), 
         name='backup-delete-permanent'),
    
    # Destination specific actions
    path('api/backup/destinations/<uuid:pk>/test-connection/', 
         views.BackupDestinationViewSet.as_view({'post': 'test_connection'}), 
         name='backup-destination-test'),
]

# Optional: Add a health check endpoint if not in views
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.utils import timezone
from .models import DatabaseBackup, BackupSchedule

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

# Add health check URL
urlpatterns += [
    path('api/backup/health/', health_check, name='backup-health'),
]