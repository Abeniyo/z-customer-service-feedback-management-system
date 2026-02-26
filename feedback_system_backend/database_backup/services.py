import os
import subprocess
import hashlib
import boto3
from datetime import datetime, timedelta
from django.conf import settings
from django.utils import timezone
from django.db import connection
from .models import BackupRecord, BackupSchedule, BackupStorageStats, BackupRestoreLog
import logging

logger = logging.getLogger(__name__)

class BackupService:
    """Service class for backup operations"""
    
    def __init__(self):
        self.db_config = settings.DATABASES['default']
        self.backup_dir = getattr(settings, 'BACKUP_DIR', '/var/backups/')
        self.s3_client = self._get_s3_client() if hasattr(settings, 'AWS_STORAGE_BUCKET_NAME') else None
    
    def _get_s3_client(self):
        """Initialize S3 client"""
        return boto3.client(
            's3',
            aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
            aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
            region_name=settings.AWS_S3_REGION_NAME
        )
    
    def create_backup(self, backup_type='full', schedule=None, user=None):
        """Create a new backup"""
        try:
            # Create backup record
            backup = BackupRecord.objects.create(
                schedule=schedule,
                backup_type=backup_type,
                name=self._generate_backup_name(backup_type),
                status='running',
                started_at=timezone.now(),
                compressed=True,
                encryption='AES-256',
                location='pending'
            )
            
            # Determine filename and path
            timestamp = timezone.now().strftime('%Y%m%d_%H%M%S')
            filename = f"backup_{backup_type}_{timestamp}.sql"
            
            if backup.compressed:
                filename += '.gz'
            
            filepath = os.path.join(self.backup_dir, filename)
            
            # Perform database backup based on type
            if backup_type == 'full':
                success = self._full_backup(filepath)
            elif backup_type == 'incremental':
                success = self._incremental_backup(filepath)
            elif backup_type == 'transaction_log':
                success = self._transaction_log_backup(filepath)
            else:
                raise ValueError(f"Unknown backup type: {backup_type}")
            
            if success:
                # Update backup record
                backup.status = 'success'
                backup.file_path = filepath
                backup.filename = filename
                backup.size_bytes = os.path.getsize(filepath)
                backup.checksum = self._calculate_checksum(filepath)
                
                # Upload to cloud if configured
                if schedule and schedule.destination in ['cloud', 'both']:
                    self._upload_to_cloud(filepath, backup)
                
                backup.location = self._get_location_string(schedule)
                backup.completed_at = timezone.now()
                backup.save()
                
                # Update schedule
                if schedule:
                    schedule.last_run = timezone.now()
                    schedule.last_status = 'success'
                    schedule.next_run = schedule.calculate_next_run()
                    schedule.save()
                
                # Update storage stats
                self._update_storage_stats()
                
                logger.info(f"Backup created successfully: {backup.name}")
                return backup
            else:
                backup.status = 'failed'
                backup.error_message = "Backup process failed"
                backup.completed_at = timezone.now()
                backup.save()
                
                if schedule:
                    schedule.last_status = 'failed'
                    schedule.error_message = "Backup process failed"
                    schedule.save()
                
                return backup
                
        except Exception as e:
            logger.error(f"Backup creation failed: {str(e)}")
            if 'backup' in locals():
                backup.status = 'failed'
                backup.error_message = str(e)
                backup.completed_at = timezone.now()
                backup.save()
            raise
    
    def _full_backup(self, filepath):
        """Perform full database backup"""
        try:
            db = self.db_config
            cmd = [
                'pg_dump' if db['ENGINE'].endswith('postgresql') else 'mysqldump',
                '-h', db['HOST'],
                '-p', str(db['PORT']),
                '-U', db['USER'],
                '-d', db['NAME'],
                '-f', filepath
            ]
            
            if filepath.endswith('.gz'):
                cmd = f"({' '.join(cmd)} | gzip > {filepath})"
                result = subprocess.run(cmd, shell=True, env={'PGPASSWORD': db['PASSWORD']})
            else:
                result = subprocess.run(cmd, env={'PGPASSWORD': db['PASSWORD']})
            
            return result.returncode == 0
        except Exception as e:
            logger.error(f"Full backup failed: {str(e)}")
            return False
    
    def _incremental_backup(self, filepath):
        """Perform incremental backup"""
        # Implementation depends on database system
        # For PostgreSQL, this might use WAL archiving
        # For simplicity, we'll do a differential backup
        return self._full_backup(filepath)  # Placeholder
    
    def _transaction_log_backup(self, filepath):
        """Backup transaction logs"""
        # Implementation depends on database system
        # For PostgreSQL, this would archive WAL files
        return self._full_backup(filepath)  # Placeholder
    
    def _generate_backup_name(self, backup_type):
        """Generate backup filename"""
        timestamp = timezone.now().strftime('%Y%m%d_%H%M%S')
        type_map = {
            'full': 'full_backup',
            'incremental': 'incremental_backup',
            'transaction_log': 'transaction_log'
        }
        return f"{type_map.get(backup_type, 'backup')}_{timestamp}.sql.gz"
    
    def _calculate_checksum(self, filepath):
        """Calculate SHA256 checksum of backup file"""
        sha256 = hashlib.sha256()
        with open(filepath, 'rb') as f:
            for block in iter(lambda: f.read(4096), b''):
                sha256.update(block)
        return f"sha256: {sha256.hexdigest()[:8]}...{sha256.hexdigest()[-4:]}"
    
    def _upload_to_cloud(self, filepath, backup):
        """Upload backup to cloud storage"""
        if not self.s3_client:
            return
        
        try:
            bucket = settings.AWS_STORAGE_BUCKET_NAME
            key = f"backups/{backup.backup_type}/{os.path.basename(filepath)}"
            
            self.s3_client.upload_file(filepath, bucket, key)
            backup.metadata['cloud_uploaded'] = True
            backup.metadata['cloud_path'] = f"s3://{bucket}/{key}"
        except Exception as e:
            logger.error(f"Cloud upload failed: {str(e)}")
            backup.metadata['cloud_uploaded'] = False
            backup.metadata['cloud_error'] = str(e)
    
    def _get_location_string(self, schedule):
        """Get location description for backup"""
        if not schedule:
            return "Manual Backup"
        
        if schedule.destination == 'local':
            return "Local Storage"
        elif schedule.destination == 'cloud':
            return "AWS S3"
        elif schedule.destination == 'both':
            return "Local + Cloud"
        elif schedule.destination == 'cold':
            return "Cold Storage"
        return schedule.destination
    
    def restore_backup(self, backup_id, target_database, user=None):
        """Restore a backup"""
        try:
            backup = BackupRecord.objects.get(id=backup_id)
            
            # Create restore log
            restore = BackupRestoreLog.objects.create(
                backup=backup,
                restored_by=user,
                target_database=target_database,
                status='running'
            )
            
            # Perform restore based on backup type
            if backup.backup_type == 'full':
                success = self._full_restore(backup)
            else:
                success = self._incremental_restore(backup)
            
            if success:
                restore.status = 'success'
                restore.completed_at = timezone.now()
                restore.save()
                return restore
            else:
                restore.status = 'failed'
                restore.error_message = "Restore failed"
                restore.completed_at = timezone.now()
                restore.save()
                return restore
                
        except Exception as e:
            logger.error(f"Restore failed: {str(e)}")
            if 'restore' in locals():
                restore.status = 'failed'
                restore.error_message = str(e)
                restore.completed_at = timezone.now()
                restore.save()
            raise
    
    def _full_restore(self, backup):
        """Perform full database restore"""
        try:
            db = self.db_config
            
            # Determine if file is compressed
            if backup.file_path.endswith('.gz'):
                cmd = f"gunzip -c {backup.file_path} | psql -h {db['HOST']} -p {db['PORT']} -U {db['USER']} -d {db['NAME']}"
            else:
                cmd = f"psql -h {db['HOST']} -p {db['PORT']} -U {db['USER']} -d {db['NAME']} -f {backup.file_path}"
            
            result = subprocess.run(cmd, shell=True, env={'PGPASSWORD': db['PASSWORD']})
            return result.returncode == 0
            
        except Exception as e:
            logger.error(f"Full restore failed: {str(e)}")
            return False
    
    def _incremental_restore(self, backup):
        """Perform incremental restore"""
        # Implementation depends on backup strategy
        return self._full_restore(backup)  # Placeholder
    
    def _update_storage_stats(self):
        """Update storage statistics"""
        today = timezone.now().date()
        stats, created = BackupStorageStats.objects.get_or_create(date=today)
        
        # Get all backups
        backups = BackupRecord.objects.filter(status='success')
        
        stats.total_backups = backups.count()
        stats.total_size_bytes = backups.aggregate(total=models.Sum('size_bytes'))['total'] or 0
        
        # Count by type
        stats.full_backups_count = backups.filter(backup_type='full').count()
        stats.full_backups_size = backups.filter(backup_type='full').aggregate(total=models.Sum('size_bytes'))['total'] or 0
        
        stats.incremental_backups_count = backups.filter(backup_type='incremental').count()
        stats.incremental_backups_size = backups.filter(backup_type='incremental').aggregate(total=models.Sum('size_bytes'))['total'] or 0
        
        stats.transaction_logs_count = backups.filter(backup_type='transaction_log').count()
        stats.transaction_logs_size = backups.filter(backup_type='transaction_log').aggregate(total=models.Sum('size_bytes'))['total'] or 0
        
        # Success rates
        stats.successful_backups = backups.filter(status='success').count()
        stats.failed_backups = BackupRecord.objects.filter(status='failed').count()
        
        stats.save()


class BackupScheduler:
    """Service for managing backup schedules"""
    
    @staticmethod
    def check_and_run_due_backups():
        """Check for and run due backups"""
        now = timezone.now()
        due_schedules = BackupSchedule.objects.filter(
            status='active',
            next_run__lte=now
        )
        
        for schedule in due_schedules:
            try:
                service = BackupService()
                backup = service.create_backup(
                    backup_type=schedule.backup_type,
                    schedule=schedule
                )
                
                # Clean up old backups based on retention
                BackupScheduler.cleanup_old_backups(schedule)
                
            except Exception as e:
                logger.error(f"Failed to run scheduled backup {schedule.id}: {str(e)}")
    
    @staticmethod
    def cleanup_old_backups(schedule):
        """Remove backups older than retention period"""
        cutoff_date = timezone.now() - timedelta(days=schedule.retention_days)
        
        old_backups = BackupRecord.objects.filter(
            schedule=schedule,
            created_at__lt=cutoff_date,
            status='success'
        )
        
        for backup in old_backups:
            try:
                # Delete file
                if os.path.exists(backup.file_path):
                    os.remove(backup.file_path)
                
                # Delete from cloud if applicable
                if backup.metadata.get('cloud_uploaded'):
                    # Implement cloud deletion
                    pass
                
                backup.status = 'deleted'
                backup.save()
                
            except Exception as e:
                logger.error(f"Failed to delete old backup {backup.id}: {str(e)}")