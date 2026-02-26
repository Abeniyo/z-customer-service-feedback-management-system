# system_health/management/commands/insert_sample_data.py

from django.core.management.base import BaseCommand
from django.utils import timezone
from datetime import timedelta
import random
import json
from system_health.models import SystemMetrics, SecurityEvent, SystemError
from axes.models import AccessAttempt
from auditlog.models import LogEntry
from system_health.models import HoneypotLog
from accounts.models import User
from django.contrib.contenttypes.models import ContentType
import psutil

class Command(BaseCommand):
    help = 'Insert sample JSON data for system health endpoints'

    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS('Inserting sample data...'))
        
        # Create a test user if doesn't exist
        user, created = User.objects.get_or_create(
            username='admin',
            defaults={
                'email': 'admin@example.com',
                'is_staff': True,
                'is_superuser': True
            }
        )
        if created:
            user.set_password('admin123')
            user.save()
            self.stdout.write(self.style.SUCCESS('Created test user: admin'))

        # 1. Insert System Metrics Data
        self.insert_system_metrics()
        
        # 2. Insert Security Events
        self.insert_security_events()
        
        # 3. Insert System Errors
        self.insert_system_errors()
        
        # 4. Insert Axes Access Attempts
        self.insert_axes_attempts(user)
        
        # 5. Insert Audit Logs
        self.insert_audit_logs(user)
        
        # 6. Insert Honeypot Logs
        self.insert_honeypot_logs()
        
        self.stdout.write(self.style.SUCCESS('✅ All sample data inserted successfully!'))
        self.stdout.write(self.style.SUCCESS('\nNow you can test these endpoints:'))
        self.stdout.write('GET /api/v1/system-health/metrics/')
        self.stdout.write('GET /api/v1/system-health/security-events/')
        self.stdout.write('GET /api/v1/system-health/system-errors/')
        self.stdout.write('GET /api/v1/system-health/axes-attempts/')
        self.stdout.write('GET /api/v1/system-health/audit-logs/')
        self.stdout.write('GET /api/v1/system-health/honeypot-logs/')

    def insert_system_metrics(self):
        """Insert sample system metrics data"""
        self.stdout.write('Inserting system metrics...')
        
        # Create metrics for the last 24 hours (every hour)
        for i in range(24):
            timestamp = timezone.now() - timedelta(hours=i)
            
            # Random but realistic values
            cpu_usage = random.randint(20, 85)
            memory_used = random.uniform(4, 28)
            disk_used = random.uniform(100, 400)
            
            SystemMetrics.objects.create(
                timestamp=timestamp,
                cpu_usage=cpu_usage,
                cpu_temperature=random.randint(45, 75),
                memory_used=memory_used,
                memory_total=32.0,
                disk_used=disk_used,
                disk_total=500.0,
                network_incoming=random.uniform(50, 500),
                network_outgoing=random.uniform(30, 400),
                active_connections=random.randint(500, 2000),
                database_connections=random.randint(20, 100)
            )
        
        self.stdout.write(self.style.SUCCESS(f'  ✅ Inserted 24 system metrics records'))

    def insert_security_events(self):
        """Insert sample security events"""
        self.stdout.write('Inserting security events...')
        
        event_types = ['brute_force', 'rate_limit', 'suspicious', 'honeypot']
        severities = ['critical', 'high', 'medium', 'low']
        statuses = ['blocked', 'limited', 'monitoring', 'resolved']
        
        # Sample IPs with countries
        ip_data = [
            {'ip': '203.45.67.89', 'country': 'RU', 'isp': 'Russian Telecom'},
            {'ip': '185.191.171.45', 'country': 'UA', 'isp': 'Hostinger'},
            {'ip': '45.227.253.84', 'country': 'CN', 'isp': 'China Telecom'},
            {'ip': '103.152.36.78', 'country': 'VN', 'isp': 'Viettel'},
            {'ip': '156.67.218.154', 'country': 'NL', 'isp': 'DigitalOcean'},
            {'ip': '192.168.1.105', 'country': 'US', 'isp': 'Google Cloud'},
            {'ip': '89.45.67.23', 'country': 'DE', 'isp': 'Deutsche Telekom'},
            {'ip': '34.78.90.12', 'country': 'FR', 'isp': 'Orange'},
        ]
        
        # Sample targets
        targets = [
            'admin@system.com', 'root@system.com', 'user@company.com',
            'support@system.com', 'api/login', 'api/auth', 'api/admin'
        ]
        
        # Create 50 security events over the last 7 days
        for i in range(50):
            days_ago = random.randint(0, 7)
            hours_ago = random.randint(0, 23)
            minutes_ago = random.randint(0, 59)
            
            timestamp = timezone.now() - timedelta(
                days=days_ago, 
                hours=hours_ago, 
                minutes=minutes_ago
            )
            
            ip_info = random.choice(ip_data)
            event_type = random.choice(event_types)
            severity = random.choice(severities)
            attempts = random.randint(5, 500)
            
            # Adjust severity based on attempts
            if attempts > 100:
                severity = 'critical'
            elif attempts > 50:
                severity = 'high'
            elif attempts > 20:
                severity = 'medium'
            
            status = 'blocked' if attempts > 50 else random.choice(statuses)
            
            SecurityEvent.objects.create(
                timestamp=timestamp,
                event_type=event_type,
                severity=severity,
                source_ip=ip_info['ip'],
                target=random.choice(targets),
                endpoint=f"/api/{random.choice(['login', 'auth', 'admin', 'data'])}/",
                attempts=attempts,
                user_agent=random.choice([
                    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                    'Mozilla/5.0 (compatible; Googlebot/2.1)',
                    'Python/3.9 aiohttp',
                    'Go-http-client/1.1',
                    'Mozilla/4.0 (compatible; MSIE 6.0)',
                ]),
                status=status,
                action_taken='IP Blocked' if status == 'blocked' else 'Rate Limited' if status == 'limited' else 'Monitoring',
                details=f"{attempts} attempts detected from {ip_info['ip']}",
                country=ip_info['country'],
                isp=ip_info['isp'],
                metadata={'user_agent': 'sample', 'risk_score': random.randint(1, 100)}
            )
        
        self.stdout.write(self.style.SUCCESS(f'  ✅ Inserted 50 security events'))

    def insert_system_errors(self):
        """Insert sample system errors"""
        self.stdout.write('Inserting system errors...')
        
        error_types = ['database', 'api', 'network', 'security', 'application', 'cache']
        severities = ['critical', 'high', 'medium', 'low']
        statuses = ['resolved', 'monitoring', 'pending']
        
        error_messages = [
            {'message': 'Connection pool exhausted', 'source': 'PostgreSQL'},
            {'message': 'Cache miss rate > 90%', 'source': 'Redis Cache'},
            {'message': 'High latency detected', 'source': 'Load Balancer'},
            {'message': 'SQL injection attempt blocked', 'source': 'WAF'},
            {'message': 'Task queue backlog', 'source': 'Celery Worker'},
            {'message': 'Memory usage threshold exceeded', 'source': 'Application Server'},
            {'message': 'Disk space running low', 'source': 'Storage'},
            {'message': 'API rate limit exceeded', 'source': 'API Gateway'},
        ]
        
        # Create 30 system errors
        for i in range(30):
            days_ago = random.randint(0, 3)
            hours_ago = random.randint(0, 23)
            
            timestamp = timezone.now() - timedelta(days=days_ago, hours=hours_ago)
            
            error_info = random.choice(error_messages)
            error_type = random.choice(error_types)
            severity = random.choice(severities)
            status = random.choice(statuses)
            
            # Calculate resolution time
            resolved_at = None
            if status == 'resolved':
                resolved_at = timestamp + timedelta(minutes=random.randint(5, 120))
            
            SystemError.objects.create(
                timestamp=timestamp,
                error_type=error_type,
                severity=severity,
                source=error_info['source'],
                message=error_info['message'],
                details=f"Detailed error information for {error_info['message']}",
                status=status,
                resolved_at=resolved_at
            )
        
        self.stdout.write(self.style.SUCCESS(f'  ✅ Inserted 30 system errors'))

    def insert_axes_attempts(self, user):
        """Insert sample axes access attempts"""
        self.stdout.write('Inserting axes access attempts...')
        
        # Note: This depends on your axes model structure
        # Adjust based on your actual axes model fields
        
        ip_addresses = [
            '203.45.67.89', '185.191.171.45', '45.227.253.84', 
            '103.152.36.78', '156.67.218.154', '192.168.1.105'
        ]
        
        usernames = ['admin', 'root', 'user', 'test', 'administrator']
        user_agents = [
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            'Python/3.9 aiohttp',
            'Go-http-client/1.1',
        ]
        
        for i in range(20):
            attempt_time = timezone.now() - timedelta(
                days=random.randint(0, 2),
                hours=random.randint(0, 23),
                minutes=random.randint(0, 59)
            )
            
            # Create AccessAttempt record
            # Note: Adjust these field names based on your actual axes model
            try:
                AccessAttempt.objects.create(
                    username=random.choice(usernames),
                    ip_address=random.choice(ip_addresses),
                    user_agent=random.choice(user_agents),
                    attempt_time=attempt_time,
                    path_info='/api/login/',
                    failures_since_start=random.randint(1, 20),
                    # Add other fields your model requires
                )
            except Exception as e:
                self.stdout.write(self.style.WARNING(f'    Skipping axes attempt: {e}'))
        
        self.stdout.write(self.style.SUCCESS(f'  ✅ Inserted axes attempts'))

    def insert_audit_logs(self, user):
        """Insert sample audit logs"""
        self.stdout.write('Inserting audit logs...')
        
        actions = ['CREATE', 'UPDATE', 'DELETE']
        models = ['User', 'SecurityEvent', 'SystemMetrics', 'BackupRecord']
        
        for i in range(40):
            timestamp = timezone.now() - timedelta(
                days=random.randint(0, 5),
                hours=random.randint(0, 23)
            )
            
            model_name = random.choice(models)
            action = random.choice(actions)
            
            # Create sample changes data
            changes = {
                'field1': {'old': 'old_value', 'new': 'new_value'},
                'field2': {'old': 100, 'new': 200}
            }
            
            # Get or create content type
            content_type, _ = ContentType.objects.get_or_create(
                app_label='system_health',
                model=model_name.lower()
            )
            
            try:
                LogEntry.objects.create(
                    content_type=content_type,
                    object_pk=str(random.randint(1, 100)),
                    object_repr=f"Sample {model_name} {i}",
                    action=random.choice([ADDITION, CHANGE, DELETION]),
                    changes=json.dumps(changes),
                    timestamp=timestamp,
                    actor=user if random.choice([True, False]) else None,
                )
            except Exception as e:
                self.stdout.write(self.style.WARNING(f'    Skipping audit log: {e}'))
        
        self.stdout.write(self.style.SUCCESS(f'  ✅ Inserted audit logs'))

    def insert_honeypot_logs(self):
        """Insert sample honeypot logs"""
        self.stdout.write('Inserting honeypot logs...')
        
        ip_addresses = [
            '203.45.67.89', '185.191.171.45', '45.227.253.84', 
            '103.152.36.78', '156.67.218.154'
        ]
        
        paths = ['/admin', '/wp-admin', '/administrator', '/login', '/wp-login.php']
        usernames = ['admin', 'root', 'administrator', 'user', 'test']
        
        for i in range(25):
            timestamp = timezone.now() - timedelta(
                days=random.randint(0, 3),
                hours=random.randint(0, 23),
                minutes=random.randint(0, 59)
            )
            
            try:
                HoneypotLog.objects.create(
                    ip_address=random.choice(ip_addresses),
                    path=random.choice(paths),
                    username=random.choice(usernames),
                    timestamp=timestamp,
                    user_agent=random.choice([
                        'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
                        'Python/3.9',
                        'Go-http-client/1.1',
                    ]),
                    request_method=random.choice(['GET', 'POST']),
                    risk_score=random.randint(1, 100),
                )
            except Exception as e:
                self.stdout.write(self.style.WARNING(f'    Skipping honeypot log: {e}'))
        
        self.stdout.write(self.style.SUCCESS(f'  ✅ Inserted honeypot logs'))

    def clear_existing_data(self):
        """Clear existing data (optional)"""
        response = input('Do you want to clear existing data? (y/n): ')
        if response.lower() == 'y':
            self.stdout.write('Clearing existing data...')
            SystemMetrics.objects.all().delete()
            SecurityEvent.objects.all().delete()
            SystemError.objects.all().delete()
            # Be careful with these - they might have dependencies
            # AccessAttempt.objects.all().delete()
            # LogEntry.objects.all().delete()
            # HoneypotLog.objects.all().delete()
            self.stdout.write(self.style.SUCCESS('  ✅ Existing data cleared'))