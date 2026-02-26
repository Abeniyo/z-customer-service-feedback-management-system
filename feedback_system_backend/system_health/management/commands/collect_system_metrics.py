# management/commands/collect_system_metrics.py
from django.core.management.base import BaseCommand
from system_health.models import SystemMetrics, SecurityEvent, SystemError
import psutil
from datetime import datetime

class Command(BaseCommand):
    help = 'Collect system metrics for dashboard'
    
    def handle(self, *args, **options):
        # Collect system metrics
        metrics = SystemMetrics.objects.create(
            cpu_usage=psutil.cpu_percent(),
            memory_used=psutil.virtual_memory().used / (1024**3),
            memory_total=psutil.virtual_memory().total / (1024**3),
            disk_used=psutil.disk_usage('/').used / (1024**3),
            disk_total=psutil.disk_usage('/').total / (1024**3),
            network_incoming=psutil.net_io_counters().bytes_recv / (1024**2),
            network_outgoing=psutil.net_io_counters().bytes_sent / (1024**2),
            active_connections=len(psutil.net_connections()),
        )
        
        # Import security events from axes
        from axes.models import AccessAttempt
        failed_attempts = AccessAttempt.objects.filter(
            attempt_time__gte=datetime.now() - timedelta(minutes=5)
        )
        
        for attempt in failed_attempts:
            SecurityEvent.objects.create(
                event_type='brute_force',
                severity='high' if attempt.failures_since_start > 10 else 'medium',
                source_ip=attempt.ip_address,
                target=attempt.username,
                endpoint='/api/login/',
                attempts=attempt.failures_since_start,
                status='blocked' if attempt.failures_since_start > 5 else 'monitoring',
                action_taken='IP Blocked' if attempt.failures_since_start > 5 else 'Monitoring',
                details=f"Failed login attempts: {attempt.failures_since_start}",
            )
        
        self.stdout.write(self.style.SUCCESS('Metrics collected successfully'))