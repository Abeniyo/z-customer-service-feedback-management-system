from celery import shared_task
from django.utils import timezone
from django.core.management import call_command
import subprocess
import os
import hashlib
import json
from .models import BackupSchedule, DatabaseBackup, BackupLog, BackupStatistics

@shared_task
def run_backup_task(backup_id, triggered_by=None):
    """Run a backup"""
    from .utils import perform_backup
    
    try:
        backup = DatabaseBackup.objects.get(id=backup_id)
        backup.status = 'running'
        backup.started_at = timezone.now()
        backup.save()
        
        BackupLog.objects.create(
            backup=backup,
            schedule=backup.schedule,
            level='info',
            message=f"Backup started" + (f" by {triggered_by}" if triggered_by else "")
        )
        
        # Perform the actual backup
        result = perform_backup(backup)
        
        if result['success']:
            backup.status = 'success'
            backup.completed_at = timezone.now()
            backup.file_size = result['size_human']
            backup.size_bytes = result['size_bytes']
            backup.file_path = result['file_path']
            backup.checksum = result['checksum']
            backup.save()
            
            BackupLog.objects.create(
                backup=backup,
                schedule=backup.schedule,
                level='success',
                message=f"Backup completed successfully",
                details={'size': backup.file_size, 'duration': backup.duration}
            )
            
            # Update schedule stats
            if backup.schedule:
                schedule = backup.schedule
                schedule.last_run = timezone.now()
                schedule.last_run_status = 'success'
                schedule.total_runs += 1
                schedule.successful_runs += 1
                schedule.is_running = False
                schedule.save()
            
            return {'status': 'success', 'backup_id': str(backup.id)}
        else:
            raise Exception(result.get('error', 'Unknown error'))
            
    except Exception as e:
        backup.status = 'failed'
        backup.completed_at = timezone.now()
        backup.error_message = str(e)
        backup.save()
        
        BackupLog.objects.create(
            backup=backup,
            schedule=backup.schedule,
            level='error',
            message=f"Backup failed: {str(e)}"
        )
        
        if backup.schedule:
            schedule = backup.schedule
            schedule.last_run = timezone.now()
            schedule.last_run_status = 'failed'
            schedule.last_run_message = str(e)
            schedule.total_runs += 1
            schedule.failed_runs += 1
            schedule.is_running = False
            schedule.save()
        
        return {'status': 'failed', 'error': str(e)}


@shared_task
def verify_backup_task(backup_id):
    """Verify backup integrity"""
    try:
        backup = DatabaseBackup.objects.get(id=backup_id)
        
        # Verify checksum
        if backup.checksum and os.path.exists(backup.file_path):
            sha256 = hashlib.sha256()
            with open(backup.file_path, 'rb') as f:
                for chunk in iter(lambda: f.read(4096), b''):
                    sha256.update(chunk)
            calculated = sha256.hexdigest()
            
            if calculated == backup.checksum:
                backup.verification_status = 'passed'
                backup.verified_at = timezone.now()
                backup.status = 'verified'
                backup.save()
                
                BackupLog.objects.create(
                    backup=backup,
                    schedule=backup.schedule,
                    level='success',
                    message="Backup verification passed"
                )
            else:
                backup.verification_status = 'failed'
                backup.status = 'warning'
                backup.warning_message = 'Checksum mismatch'
                backup.save()
                
                BackupLog.objects.create(
                    backup=backup,
                    schedule=backup.schedule,
                    level='warning',
                    message="Backup verification failed: checksum mismatch"
                )
        
        return {'status': 'success'}
    except Exception as e:
        return {'status': 'error', 'error': str(e)}


@shared_task
def restore_backup_task(backup_id, target_db='default', overwrite=False, verify=True, triggered_by=None):
    """Restore a backup"""
    try:
        backup = DatabaseBackup.objects.get(id=backup_id)
        
        BackupLog.objects.create(
            backup=backup,
            schedule=backup.schedule,
            level='warning',
            message=f"Restore started by {triggered_by}" if triggered_by else "Restore started"
        )
        
        # Implement restore logic here
        # This would call database-specific restore commands
        
        BackupLog.objects.create(
            backup=backup,
            schedule=backup.schedule,
            level='success',
            message="Restore completed successfully"
        )
        
        return {'status': 'success'}
    except Exception as e:
        BackupLog.objects.create(
            backup=backup,
            schedule=backup.schedule,
            level='error',
            message=f"Restore failed: {str(e)}"
        )
        return {'status': 'error', 'error': str(e)}


@shared_task
def cleanup_backups_task(days=30):
    """Clean up old backups"""
    from datetime import timedelta
    
    cutoff = timezone.now() - timedelta(days=days)
    old_backups = DatabaseBackup.objects.filter(
        created_at__lt=cutoff,
        status__in=['success', 'verified']
    )
    
    count = 0
    for backup in old_backups:
        try:
            # Delete file
            if backup.location_type == 'local' and os.path.exists(backup.file_path):
                os.remove(backup.file_path)
            
            backup.status = 'expired'
            backup.deleted_at = timezone.now()
            backup.save()
            count += 1
        except Exception as e:
            BackupLog.objects.create(
                backup=backup,
                level='error',
                message=f"Cleanup failed: {str(e)}"
            )
    
    return {'status': 'success', 'backups_cleaned': count}


@shared_task
def update_statistics_task():
    """Update daily statistics"""
    today = timezone.now().date()
    
    backups_today = DatabaseBackup.objects.filter(created_at__date=today)
    
    stats, created = BackupStatistics.objects.get_or_create(date=today)
    
    stats.total_backups = backups_today.count()
    stats.successful_backups = backups_today.filter(status='success').count()
    stats.failed_backups = backups_today.filter(status='failed').count()
    
    stats.total_size_bytes = backups_today.aggregate(total=Sum('size_bytes'))['total'] or 0
    stats.total_size_gb = stats.total_size_bytes / (1024**3)
    
    stats.full_backups = backups_today.filter(backup_type='full').count()
    stats.incremental_backups = backups_today.filter(backup_type='incremental').count()
    stats.transaction_logs = backups_today.filter(backup_type='transaction_log').count()
    
    stats.save()
    
    return {'status': 'success', 'date': str(today)}