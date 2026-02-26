# backup_manager/management/commands/generate_test_backup_data.py
from django.core.management.base import BaseCommand
from django.utils import timezone
from django.contrib.auth import get_user_model
from database_backup.models import (
    BackupSchedule, DatabaseBackup, BackupLog, 
    BackupStatistics, BackupDestination
)



from datetime import timedelta
import random
import uuid
from faker import Faker
from django.db import models

fake = Faker()
User = get_user_model()

class Command(BaseCommand):
    help = 'Generate test data for database backup management'
    
    def add_arguments(self, parser):
        parser.add_argument('--days', type=int, default=30, help='Number of days of history')
        parser.add_argument('--backups-per-day', type=int, default=5, help='Average backups per day')
    
    def handle(self, *args, **options):
        days = options['days']
        backups_per_day = options['backups_per_day']
        
        self.stdout.write(f"Generating test data for {days} days...")
        
        # Create admin user if not exists
        admin_user, created = User.objects.get_or_create(
            username='admin',
            defaults={
                'email': 'admin@example.com',
                'is_staff': True,
                'is_superuser': True
            }
        )
        if created:
            admin_user.set_password('admin123')
            admin_user.save()
            self.stdout.write(self.style.SUCCESS('Created admin user'))
        
        # Create backup destinations
        self.create_destinations()
        
        # Create backup schedules
        schedules = self.create_schedules(admin_user)
        
        # Create backup history
        self.create_backup_history(schedules, admin_user, days, backups_per_day)
        
        # Create statistics
        self.create_statistics(days)
        
        self.stdout.write(self.style.SUCCESS('Test data generated successfully!'))
    
    def create_destinations(self):
        """Create backup destinations"""
        destinations = [
            {
                'name': 'Local Storage - Primary',
                'type': 'local',
                'host': 'localhost',
                'base_path': '/backups/primary',
                'total_space_gb': 2000,
                'used_space_gb': 1245.6,
                'free_space_gb': 754.4,
                'status': 'active',
                'is_default': True,
                'priority': 1
            },
            {
                'name': 'AWS S3 - US East',
                'type': 's3',
                'bucket_name': 'company-backups-prod',
                'region': 'us-east-1',
                'base_path': '/',
                'total_space_gb': 5000,
                'used_space_gb': 2345.8,
                'free_space_gb': 2654.2,
                'status': 'active',
                'is_default': False,
                'priority': 2
            },
            {
                'name': 'Google Cloud Storage',
                'type': 'gcs',
                'bucket_name': 'company-backups-eu',
                'region': 'europe-west1',
                'base_path': '/',
                'total_space_gb': 3000,
                'used_space_gb': 892.3,
                'free_space_gb': 2107.7,
                'status': 'active',
                'is_default': False,
                'priority': 3
            },
            {
                'name': 'Cold Storage Archive',
                'type': 'cold',
                'bucket_name': 'company-archive',
                'region': 'us-west-2',
                'base_path': '/archive',
                'total_space_gb': 10000,
                'used_space_gb': 3421.5,
                'free_space_gb': 6578.5,
                'status': 'active',
                'is_default': False,
                'priority': 4
            },
            {
                'name': 'Azure Blob Storage',
                'type': 'azure',
                'bucket_name': 'company-backups-asia',
                'region': 'asia-east1',
                'base_path': '/',
                'total_space_gb': 2500,
                'used_space_gb': 567.2,
                'free_space_gb': 1932.8,
                'status': 'maintenance',
                'is_default': False,
                'priority': 5
            },
            {
                'name': 'DR Site - Secondary',
                'type': 'local',
                'host': 'backup-dr.company.com',
                'base_path': '/mnt/backups',
                'total_space_gb': 1500,
                'used_space_gb': 892.4,
                'free_space_gb': 607.6,
                'status': 'active',
                'is_default': False,
                'priority': 6
            }
        ]
        
        for dest_data in destinations:
            BackupDestination.objects.update_or_create(
                name=dest_data['name'],
                defaults=dest_data
            )
        
        self.stdout.write(f"Created {len(destinations)} backup destinations")
    
    def create_schedules(self, admin_user):
        """Create backup schedules"""
        schedules_data = [
            {
                'name': 'Daily Full Backup',
                'description': 'Complete database backup every night',
                'backup_type': 'full',
                'frequency': 'daily',
                'scheduled_time': '02:00:00',
                'retention_days': 30,
                'retention_count': 10,
                'destination_type': 'both',
                'destination_path': '/backups/daily/full',
                's3_bucket': 'company-backups-prod',
                's3_path': 'daily/full/',
                'compression_enabled': True,
                'encryption_enabled': True,
                'verification_enabled': True,
                'status': 'active',
                'total_runs': 187,
                'successful_runs': 185,
                'failed_runs': 2,
                'last_run': timezone.now() - timedelta(hours=14),
                'last_run_status': 'success',
                'next_run': timezone.now() + timedelta(hours=10),
            },
            {
                'name': 'Hourly Incremental',
                'description': 'Incremental backups every hour',
                'backup_type': 'incremental',
                'frequency': 'hourly',
                'scheduled_time': '00:00:00',
                'retention_days': 7,
                'retention_count': 168,
                'destination_type': 'both',
                'destination_path': '/backups/hourly/incr',
                's3_bucket': 'company-backups-prod',
                's3_path': 'hourly/incremental/',
                'compression_enabled': True,
                'encryption_enabled': True,
                'verification_enabled': True,
                'status': 'active',
                'total_runs': 3456,
                'successful_runs': 3421,
                'failed_runs': 35,
                'last_run': timezone.now() - timedelta(minutes=45),
                'last_run_status': 'success',
                'next_run': timezone.now() + timedelta(minutes=15),
            },
            {
                'name': 'Weekly Archive',
                'description': 'Weekly full backup for long-term retention',
                'backup_type': 'full',
                'frequency': 'weekly',
                'scheduled_time': '03:00:00',
                'scheduled_day': 0,  # Sunday
                'retention_days': 90,
                'retention_count': 13,
                'destination_type': 'cold',
                's3_bucket': 'company-archive',
                's3_path': 'weekly/',
                'compression_enabled': True,
                'encryption_enabled': True,
                'verification_enabled': True,
                'status': 'paused',
                'total_runs': 52,
                'successful_runs': 51,
                'failed_runs': 1,
                'last_run': timezone.now() - timedelta(days=5),
                'last_run_status': 'success',
                'next_run': timezone.now() + timedelta(days=2),
            },
            {
                'name': 'Transaction Logs',
                'description': 'Continuous transaction log backups',
                'backup_type': 'transaction_log',
                'frequency': 'continuous',
                'retention_days': 2,
                'retention_count': 192,
                'destination_type': 'local',
                'destination_path': '/backups/transactions',
                'compression_enabled': False,
                'encryption_enabled': True,
                'verification_enabled': False,
                'status': 'active',
                'total_runs': 8923,
                'successful_runs': 8876,
                'failed_runs': 47,
                'last_run': timezone.now() - timedelta(minutes=5),
                'last_run_status': 'success',
                'next_run': timezone.now() + timedelta(minutes=10),
            },
            {
                'name': 'Monthly Cold Storage',
                'description': 'Monthly backup for compliance',
                'backup_type': 'full',
                'frequency': 'monthly',
                'scheduled_time': '04:00:00',
                'scheduled_day': 1,
                'retention_days': 365,
                'retention_count': 12,
                'destination_type': 'cold',
                's3_bucket': 'company-archive',
                's3_path': 'monthly/',
                'compression_enabled': True,
                'encryption_enabled': True,
                'verification_enabled': True,
                'status': 'active',
                'total_runs': 24,
                'successful_runs': 23,
                'failed_runs': 1,
                'last_run': timezone.now() - timedelta(days=12),
                'last_run_status': 'warning',
                'last_run_message': 'Verification warning: slow restore detected',
                'next_run': timezone.now() + timedelta(days=19),
            },
            {
                'name': 'Differential Wednesday',
                'description': 'Weekly differential backup',
                'backup_type': 'differential',
                'frequency': 'weekly',
                'scheduled_time': '01:00:00',
                'scheduled_day': 3,  # Wednesday
                'retention_days': 14,
                'retention_count': 2,
                'destination_type': 'local',
                'destination_path': '/backups/differential',
                'compression_enabled': True,
                'encryption_enabled': True,
                'verification_enabled': True,
                'status': 'failed',
                'total_runs': 45,
                'successful_runs': 38,
                'failed_runs': 7,
                'last_run': timezone.now() - timedelta(days=1),
                'last_run_status': 'failed',
                'last_run_message': 'Connection timeout to database',
                'next_run': timezone.now() + timedelta(days=6),
            }
        ]
        
        schedules = []
        for schedule_data in schedules_data:
            schedule, created = BackupSchedule.objects.update_or_create(
                name=schedule_data['name'],
                defaults={
                    **schedule_data,
                    'created_by': admin_user
                }
            )
            schedules.append(schedule)
        
        self.stdout.write(f"Created {len(schedules)} backup schedules")
        return schedules
    
    def create_backup_history(self, schedules, admin_user, days, backups_per_day):
        """Create backup history"""
        backup_types = ['full', 'incremental', 'transaction_log', 'differential']
        statuses = ['success', 'success', 'success', 'success', 'success', 'warning', 'failed']
        locations = ['local', 's3', 'both', 'cold']
        
        total_backups = 0
        
        for day in range(days):
            day_date = timezone.now() - timedelta(days=day)
            day_start = day_date.replace(hour=0, minute=0, second=0, microsecond=0)
            
            # Number of backups this day (vary by day)
            day_backups = random.randint(
                max(1, backups_per_day - 3),
                backups_per_day + 3
            )
            
            for i in range(day_backups):
                # Random time during the day
                hour = random.randint(0, 23)
                minute = random.randint(0, 59)
                second = random.randint(0, 59)
                
                backup_time = day_start + timedelta(
                    hours=hour, 
                    minutes=minute, 
                    seconds=second
                )
                
                # Don't create future backups
                if backup_time > timezone.now():
                    continue
                
                # Select random schedule or None for manual backups
                schedule = random.choice([None] + schedules) if random.random() > 0.3 else random.choice(schedules)
                
                # Backup type
                if schedule:
                    backup_type = schedule.backup_type
                else:
                    backup_type = random.choice(backup_types)
                
                # Status with time-based degradation (older backups more likely to be successful)
                days_ago = (timezone.now() - backup_time).days
                if days_ago > 20:
                    status = random.choices(
                        statuses, 
                        weights=[70, 15, 10, 3, 1, 1, 0]  # More successes for old backups
                    )[0]
                elif days_ago > 10:
                    status = random.choices(
                        statuses,
                        weights=[60, 20, 10, 5, 3, 1, 1]
                    )[0]
                else:
                    status = random.choices(
                        statuses,
                        weights=[50, 20, 10, 5, 5, 5, 5]
                    )[0]
                
                # Size based on type
                if backup_type == 'full':
                    size_mb = random.randint(180000, 195000)  # ~180-195 GB
                elif backup_type == 'incremental':
                    size_mb = random.randint(10, 50)  # 10-50 MB
                elif backup_type == 'transaction_log':
                    size_mb = random.randint(30, 80)  # 30-80 MB
                else:  # differential
                    size_mb = random.randint(500, 2000)  # 0.5-2 GB
                
                size_bytes = size_mb * 1024 * 1024
                
                # Generate checksum
                checksum = fake.sha256()
                
                # Duration based on size
                if size_mb > 100000:  # >100 GB
                    duration_seconds = random.randint(2400, 3000)  # 40-50 minutes
                elif size_mb > 1000:  # >1 GB
                    duration_seconds = random.randint(300, 900)  # 5-15 minutes
                elif size_mb > 100:  # >100 MB
                    duration_seconds = random.randint(60, 180)  # 1-3 minutes
                else:
                    duration_seconds = random.randint(20, 60)  # 20-60 seconds
                
                started_at = backup_time
                completed_at = started_at + timedelta(seconds=duration_seconds)
                
                # Location
                if schedule:
                    location_type = schedule.destination_type
                else:
                    location_type = random.choice(locations)
                
                # Filename
                timestamp = backup_time.strftime('%Y%m%d_%H%M%S')
                filename = f"{backup_type}_backup_{timestamp}.sql"
                if random.random() > 0.3:  # 70% compressed
                    filename += '.gz'
                
                # File path
                if location_type == 'local':
                    file_path = f"/backups/{backup_time.strftime('%Y/%m/%d')}/{filename}"
                elif location_type == 's3':
                    file_path = f"s3://company-backups-prod/{backup_time.strftime('%Y/%m/%d')}/{filename}"
                elif location_type == 'cold':
                    file_path = f"s3://company-archive/{backup_time.strftime('%Y/%m')}/{filename}"
                else:
                    file_path = f"/backups/{backup_time.strftime('%Y/%m/%d')}/{filename} (synced to cloud)"
                
                # S3 info
                s3_bucket = None
                s3_key = None
                if location_type in ['s3', 'both', 'cold']:
                    s3_bucket = 'company-backups-prod' if location_type != 'cold' else 'company-archive'
                    s3_key = f"{backup_time.strftime('%Y/%m/%d')}/{filename}"
                
                # Error/warning messages
                error_message = ''
                warning_message = ''
                if status == 'failed':
                    errors = [
                        'Connection timeout to database',
                        'Disk full - insufficient space',
                        'Network error during transfer',
                        'Authentication failed',
                        'Lock timeout - database busy',
                        'Corrupted backup file',
                        'Checksum verification failed'
                    ]
                    error_message = random.choice(errors)
                elif status == 'warning':
                    warnings = [
                        'Slow backup performance detected',
                        'High compression ratio - possible data issue',
                        'Verification warning: checksum mismatch',
                        'Partial success - some tables skipped',
                        'Retry needed for some segments',
                        'S3 upload delayed'
                    ]
                    warning_message = random.choice(warnings)
                
                # Create backup
                backup = DatabaseBackup.objects.create(
                    schedule=schedule,
                    name=filename,
                    backup_type=backup_type,
                    filename=filename,
                    file_path=file_path,
                    file_size=f"{size_mb} MB" if size_mb < 1000 else f"{size_mb/1000:.1f} GB",
                    size_bytes=size_bytes,
                    checksum=checksum,
                    checksum_type='sha256',
                    database_name='default',
                    database_version='PostgreSQL 14.5',
                    backup_version='1.0',
                    created_at=backup_time,
                    started_at=started_at,
                    completed_at=completed_at,
                    status=status,
                    verification_status='passed' if status == 'success' else 'failed' if status == 'failed' else 'pending',
                    verified_at=completed_at + timedelta(minutes=5) if status == 'success' else None,
                    location_type=location_type,
                    location_path=file_path,
                    s3_bucket=s3_bucket,
                    s3_key=s3_key,
                    compression_enabled=filename.endswith('.gz'),
                    encryption_enabled=True,
                    encryption_algorithm='AES-256',
                    log_file=f"/logs/backups/{timestamp}.log",
                    error_message=error_message,
                    warning_message=warning_message,
                    created_by=admin_user if not schedule else None,
                    metadata={
                        'tables_count': random.randint(150, 250),
                        'rows_backed_up': random.randint(1000000, 5000000),
                        'compression_ratio': round(random.uniform(2.5, 4.0), 2),
                        'encryption_time_ms': random.randint(500, 2000)
                    },
                    expires_at=backup_time + timedelta(days=30)
                )
                
                # Create logs for this backup
                self.create_backup_logs(backup)
                
                total_backups += 1
                
                # Update schedule stats
                if schedule and status == 'success':
                    schedule.successful_runs += 1
                    schedule.total_runs += 1
                elif schedule and status == 'failed':
                    schedule.failed_runs += 1
                    schedule.total_runs += 1
                
                if schedule:
                    schedule.save()
        
        self.stdout.write(f"Created {total_backups} backup records")
    
    def create_backup_logs(self, backup):
        """Create logs for a backup"""
        log_levels = ['info', 'success', 'warning', 'error', 'debug']
        
        # Start log
        BackupLog.objects.create(
            backup=backup,
            schedule=backup.schedule,
            level='info',
            message=f"Backup started: {backup.name}",
            details={'action': 'start', 'timestamp': backup.started_at.isoformat()}
        )
        
        # Progress logs
        if backup.size_bytes > 100 * 1024 * 1024:  # >100MB
            for progress in [25, 50, 75]:
                BackupLog.objects.create(
                    backup=backup,
                    schedule=backup.schedule,
                    level='debug',
                    message=f"Backup progress: {progress}%",
                    details={'progress': progress}
                )
        
        # Type-specific logs
        if backup.backup_type == 'full':
            BackupLog.objects.create(
                backup=backup,
                schedule=backup.schedule,
                level='info',
                message="Performing full database dump",
                details={'method': 'pg_dump', 'format': 'custom'}
            )
        elif backup.backup_type == 'incremental':
            BackupLog.objects.create(
                backup=backup,
                schedule=backup.schedule,
                level='info',
                message="Performing incremental backup since last full",
                details={'base_backup': 'full_backup_20260224_0200.sql.gz'}
            )
        
        # Compression log
        if backup.compression_enabled:
            BackupLog.objects.create(
                backup=backup,
                schedule=backup.schedule,
                level='info',
                message=f"Compressing backup (ratio: {backup.metadata.get('compression_ratio', 3.2)}x)",
                details={'algorithm': 'gzip', 'level': 9}
            )
        
        # Encryption log
        if backup.encryption_enabled:
            BackupLog.objects.create(
                backup=backup,
                schedule=backup.schedule,
                level='info',
                message=f"Encrypting with {backup.encryption_algorithm}",
                details={'algorithm': backup.encryption_algorithm}
            )
        
        # Verification log
        if backup.verification_status == 'passed':
            BackupLog.objects.create(
                backup=backup,
                schedule=backup.schedule,
                level='success',
                message="Backup verification passed",
                details={'checksum': backup.checksum[:16] + '...'}
            )
        elif backup.verification_status == 'failed':
            BackupLog.objects.create(
                backup=backup,
                schedule=backup.schedule,
                level='error',
                message="Backup verification failed: checksum mismatch",
                details={'expected': backup.checksum, 'calculated': fake.sha256()}
            )
        
        # Upload logs
        if backup.location_type in ['s3', 'both', 'cold']:
            BackupLog.objects.create(
                backup=backup,
                schedule=backup.schedule,
                level='info',
                message=f"Uploading to S3 bucket: {backup.s3_bucket}",
                details={'bucket': backup.s3_bucket, 'key': backup.s3_key}
            )
            
            if backup.location_type == 'cold':
                BackupLog.objects.create(
                    backup=backup,
                    schedule=backup.schedule,
                    level='info',
                    message="Storing in cold storage tier",
                    details={'storage_class': 'STANDARD_IA'}
                )
        
        # Status logs
        if backup.status == 'success':
            BackupLog.objects.create(
                backup=backup,
                schedule=backup.schedule,
                level='success',
                message=f"Backup completed successfully in {backup.duration}",
                details={
                    'size': backup.file_size,
                    'duration_seconds': (backup.completed_at - backup.started_at).total_seconds()
                }
            )
        elif backup.status == 'failed':
            BackupLog.objects.create(
                backup=backup,
                schedule=backup.schedule,
                level='error',
                message=f"Backup failed: {backup.error_message}",
                details={'error': backup.error_message}
            )
        elif backup.status == 'warning':
            BackupLog.objects.create(
                backup=backup,
                schedule=backup.schedule,
                level='warning',
                message=f"Backup completed with warnings: {backup.warning_message}",
                details={'warning': backup.warning_message}
            )
    
    def create_statistics(self, days):
        """Create daily statistics"""
        for day in range(days):
            stat_date = (timezone.now() - timedelta(days=day)).date()
            
            # Get backups for this day
            day_start = timezone.make_aware(datetime.combine(stat_date, datetime.min.time()))
            day_end = day_start + timedelta(days=1)
            
            day_backups = DatabaseBackup.objects.filter(
                created_at__gte=day_start,
                created_at__lt=day_end
            )
            
            if not day_backups.exists():
                continue
            
            total_size = day_backups.aggregate(total=models.Sum('size_bytes'))['total'] or 0
            
            # Create or update statistics
            stats, created = BackupStatistics.objects.update_or_create(
                date=stat_date,
                defaults={
                    'total_backups': day_backups.count(),
                    'successful_backups': day_backups.filter(status='success').count(),
                    'failed_backups': day_backups.filter(status='failed').count(),
                    'total_size_bytes': total_size,
                    'total_size_gb': total_size / (1024**3),
                    'full_backups': day_backups.filter(backup_type='full').count(),
                    'incremental_backups': day_backups.filter(backup_type='incremental').count(),
                    'transaction_logs': day_backups.filter(backup_type='transaction_log').count(),
                    'local_storage_gb': day_backups.filter(location_type='local').aggregate(
                        total=models.Sum('size_bytes'))['total'] or 0 / (1024**3),
                    'cloud_storage_gb': day_backups.filter(location_type__in=['s3', 'both']).aggregate(
                        total=models.Sum('size_bytes'))['total'] or 0 / (1024**3),
                    'cold_storage_gb': day_backups.filter(location_type='cold').aggregate(
                        total=models.Sum('size_bytes'))['total'] or 0 / (1024**3),
                }
            )
        
        self.stdout.write(f"Created/updated statistics for {days} days")