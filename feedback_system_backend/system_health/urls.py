from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'metrics', views.SystemMetricsViewSet, basename='system-metrics')
router.register(r'security-events', views.SecurityEventViewSet, basename='security-events')
router.register(r'system-errors', views.SystemErrorViewSet, basename='system-errors')
router.register(r'axes-attempts', views.AxesAccessAttemptViewSet, basename='axes-attempts')
router.register(r'audit-logs', views.AuditLogViewSet, basename='audit-logs')
router.register(r'honeypot-logs', views.HoneypotLogViewSet, basename='honeypot-logs')

urlpatterns = [
    # All router URLs will be under api/v1/system-health/
    path('', include(router.urls)),
    
    # Additional endpoints
    path('dashboard/', views.DashboardOverviewAPIView.as_view(), name='dashboard-overview'),
    path('realtime/', views.realtime_stats, name='realtime-stats'),
]