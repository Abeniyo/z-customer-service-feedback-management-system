# backup_manager/management/commands/generate_test_backup_data.py
from django.core.management.base import BaseCommand
from django.utils import timezone
from django.contrib.auth import get_user_model
from backup_manager.models import (
    BackupSchedule, DatabaseBackup, BackupLog, 
    BackupStatistics, BackupDestination
)
from datetime import timedelta, datetime
import random
import uuid

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
                'total_space_gb': 2000.0,
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
                'total_space_gb': 5000.0,
                'used_space_gb': 2345.8,
                'free_space_gb': 2654.2,
                'status': 'active',
                'is_default': False,
                'priority': 2
            },
            {
                'name': 'Cold Storage Archive',
                'type': 'cold',
                'bucket_name': 'company-archive',
                'region': 'us-west-2',
                'base_path': '/archive',
                'total_space_gb': 10000.0,
                'used_space_gb': 3421.5,
                'free_space_gb': 6578.5,
                'status': 'active',
                'is_default': False,
                'priority': 3
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
        backup_types = ['full', 'incremental', 'transaction_log']
        statuses = ['success', 'success', 'success', 'success', 'success', 'warning', 'failed']
        locations = ['local', 's3', 'both', 'cold']
        
        total_backups = 0
        
        for day in range(days):
            day_date = timezone.now() - timedelta(days=day)
            day_start = day_date.replace(hour=0, minute=0, second=0, microsecond=0)
            
            # Number of backups this day
            day_backups = random.randint(
                max(1, backups_per_day - 2),
                backups_per_day + 2
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
                
                # Select random schedule
                schedule = random.choice([None] + schedules) if random.random() > 0.3 else random.choice(schedules)
                
                # Backup type
                if schedule:
                    backup_type = schedule.backup_type
                else:
                    backup_type = random.choice(backup_types)
                
                # Status
                status = random.choices(
                    statuses,
                    weights=[50, 20, 10, 5, 5, 5, 5]
                )[0]
                
                # Size based on type
                if backup_type == 'full':
                    size_mb = random.randint(180000, 195000)  # ~180-195 GB
                elif backup_type == 'incremental':
                    size_mb = random.randint(10, 50)  # 10-50 MB
                else:  # transaction_log
                    size_mb = random.randint(30, 80)  # 30-80 MB
                
                size_bytes = size_mb * 1024 * 1024
                
                # Generate checksum
                checksum = ''.join(random.choices('0123456789abcdef', k=64))
                
                # Duration based on size
                if size_mb > 100000:
                    duration_seconds = random.randint(2400, 3000)  # 40-50 minutes
                elif size_mb > 1000:
                    duration_seconds = random.randint(300, 900)  # 5-15 minutes
                elif size_mb > 100:
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
                else:
                    file_path = f"/backups/{backup_time.strftime('%Y/%m/%d')}/{filename} (synced to cloud)"
                
                # Error/warning messages
                error_message = ''
                warning_message = ''
                if status == 'failed':
                    errors = [
                        'Connection timeout to database',
                        'Disk full - insufficient space',
                        'Network error during transfer',
                    ]
                    error_message = random.choice(errors)
                elif status == 'warning':
                    warnings = [
                        'Slow backup performance detected',
                        'Verification warning: checksum mismatch',
                        'Partial success - some tables skipped',
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
                    },
                    expires_at=backup_time + timedelta(days=30)
                )
                
                # Create logs
                self.create_backup_logs(backup)
                
                total_backups += 1
        
        self.stdout.write(f"Created {total_backups} backup records")
    
    def create_backup_logs(self, backup):
        """Create logs for a backup"""
        # Start log
        BackupLog.objects.create(
            backup=backup,
            schedule=backup.schedule,
            level='info',
            timestamp=backup.started_at,
            message=f"Backup started: {backup.name}",
        )
        
        # Progress logs
        if backup.size_bytes > 100 * 1024 * 1024:  # >100MB
            for progress in [25, 50, 75]:
                BackupLog.objects.create(
                    backup=backup,
                    schedule=backup.schedule,
                    level='debug',
                    timestamp=backup.started_at + timedelta(seconds=backup.duration_seconds * progress/100),
                    message=f"Backup progress: {progress}%",
                )
        
        # Completion log
        if backup.status == 'success':
            BackupLog.objects.create(
                backup=backup,
                schedule=backup.schedule,
                level='success',
                timestamp=backup.completed_at,
                message=f"Backup completed successfully in {backup.duration}",
            )
        elif backup.status == 'failed':
            BackupLog.objects.create(
                backup=backup,
                schedule=backup.schedule,
                level='error',
                timestamp=backup.completed_at,
                message=f"Backup failed: {backup.error_message}",
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
            BackupStatistics.objects.update_or_create(
                date=stat_date,
                defaults={
                    'total_backups': day_backups.count(),
                    'successful_backups': day_backups.filter(status='success').count(),
                    'failed_backups': day_backups.filter(status='failed').count(),
                    'total_size_bytes': total_size,
                    'total_size_gb': total_size / (1024**3),
                }
            )