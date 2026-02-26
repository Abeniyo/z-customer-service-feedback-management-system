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
    path('api/backup/', include(router.urls)),
    path('api/backup/dashboard/', views.DashboardAPIView.as_view(), name='backup-dashboard'),
    path('api/backup/cleanup/', views.cleanup_old_backups, name='backup-cleanup'),
]