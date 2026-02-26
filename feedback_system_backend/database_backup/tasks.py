from celery import shared_task
from django.utils import timezone
from django.core.mail import send_mail
from django.conf import settings
from datetime import timedelta
import os

from .models import BackupSchedule, DatabaseBackup, BackupLog, BackupStatistics
from .utils import perform_backup, verify_backup_integrity, calculate_next_run

@shared_task(bind=True, max_retries=3)
def run_backup_task(self, backup_id, triggered_by=None):
    """Run a backup"""
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
                schedule.next_run = calculate_next_run(schedule)
                schedule.save()
                
                # Send notification if enabled
                if schedule.notify_on_success:
                    send_backup_notification.delay(backup.id, 'success')
            
            # Verify backup if enabled
            if backup.schedule and backup.schedule.verification_enabled:
                verify_backup_task.delay(backup.id)
            
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
            
            # Send notification if enabled
            if schedule.notify_on_failure:
                send_backup_notification.delay(backup.id, 'failed')
        
        # Retry logic
        retry_count = self.request.retries
        if retry_count < 3:
            self.retry(countdown=60 * (retry_count + 1))  # Exponential backoff
        
        return {'status': 'failed', 'error': str(e)}


@shared_task
def verify_backup_task(backup_id):
    """Verify backup integrity"""
    try:
        backup = DatabaseBackup.objects.get(id=backup_id)
        
        result = verify_backup_integrity(backup)
        
        backup.verification_status = 'passed' if result['verified'] else 'failed'
        backup.verified_at = timezone.now()
        
        if result['verified']:
            backup.status = 'verified' if backup.status == 'success' else backup.status
            backup.save()
            
            BackupLog.objects.create(
                backup=backup,
                schedule=backup.schedule,
                level='success',
                message=result['message'],
                details=result['details']
            )
        else:
            backup.status = 'warning'
            backup.warning_message = result['message']
            backup.save()
            
            BackupLog.objects.create(
                backup=backup,
                schedule=backup.schedule,
                level='warning',
                message=result['message'],
                details=result['details']
            )
        
        return {'status': 'success', 'verified': result['verified']}
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
        
        # Verify before restore if requested
        if verify:
            verify_result = verify_backup_integrity(backup)
            if not verify_result['verified']:
                raise Exception("Backup verification failed before restore")
        
        # Implement restore logic based on database type
        db_engine = settings.DATABASES[target_db]['ENGINE']
        
        if 'postgresql' in db_engine:
            result = _postgresql_restore(backup, target_db)
        elif 'mysql' in db_engine:
            result = _mysql_restore(backup, target_db)
        elif 'sqlite3' in db_engine:
            result = _sqlite_restore(backup, target_db)
        else:
            raise Exception(f"Unsupported database engine: {db_engine}")
        
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
    cutoff = timezone.now() - timedelta(days=days)
    old_backups = DatabaseBackup.objects.filter(
        created_at__lt=cutoff,
        status__in=['success', 'verified', 'warning']
    )
    
    count = 0
    deleted_size = 0
    
    for backup in old_backups:
        try:
            # Delete file from local storage
            if backup.location_type in ['local', 'both'] and os.path.exists(backup.file_path):
                file_size = os.path.getsize(backup.file_path)
                os.remove(backup.file_path)
                deleted_size += file_size
            
            # Delete from S3 if applicable
            if backup.location_type in ['s3', 'both', 'cold'] and backup.s3_bucket:
                # Implement S3 deletion
                pass
            
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
    
    return {
        'status': 'success',
        'backups_cleaned': count,
        'space_freed_gb': deleted_size / (1024**3)
    }


@shared_task
def update_statistics_task():
    """Update daily statistics"""
    today = timezone.now().date()
    
    backups_today = DatabaseBackup.objects.filter(created_at__date=today)
    
    stats, created = BackupStatistics.objects.get_or_create(date=today)
    
    stats.total_backups = backups_today.count()
    stats.successful_backups = backups_today.filter(status='success').count()
    stats.failed_backups = backups_today.filter(status='failed').count()
    
    stats.total_size_bytes = backups_today.aggregate(total=models.Sum('size_bytes'))['total'] or 0
    stats.total_size_gb = stats.total_size_bytes / (1024**3)
    
    if stats.total_backups > 0:
        stats.average_size_bytes = stats.total_size_bytes / stats.total_backups
    
    stats.full_backups = backups_today.filter(backup_type='full').count()
    stats.incremental_backups = backups_today.filter(backup_type='incremental').count()
    stats.transaction_logs = backups_today.filter(backup_type='transaction_log').count()
    
    # Calculate storage by type
    stats.local_storage_gb = backups_today.filter(
        location_type='local'
    ).aggregate(total=models.Sum('size_bytes'))['total'] or 0 / (1024**3)
    
    stats.cloud_storage_gb = backups_today.filter(
        location_type__in=['s3', 'both']
    ).aggregate(total=models.Sum('size_bytes'))['total'] or 0 / (1024**3)
    
    stats.cold_storage_gb = backups_today.filter(
        location_type='cold'
    ).aggregate(total=models.Sum('size_bytes'))['total'] or 0 / (1024**3)
    
    # Schedule stats
    stats.active_schedules = BackupSchedule.objects.filter(status='active').count()
    stats.paused_schedules = BackupSchedule.objects.filter(status='paused').count()
    
    stats.save()
    
    return {'status': 'success', 'date': str(today), 'created': created}


@shared_task
def send_backup_notification(backup_id, status_type):
    """Send email notification about backup"""
    try:
        backup = DatabaseBackup.objects.get(id=backup_id)
        
        subject = f"Backup {status_type}: {backup.name}"
        
        if status_type == 'success':
            message = f"""
Backup completed successfully!

Backup Name: {backup.name}
Type: {backup.get_backup_type_display()}
Size: {backup.file_size}
Duration: {backup.duration}
Created: {backup.created_at}
Location: {backup.location_path}
            """
        else:
            message = f"""
Backup failed!

Backup Name: {backup.name}
Type: {backup.get_backup_type_display()}
Error: {backup.error_message}
Time: {backup.created_at}
            """
        
        # Send to admins
        from django.core.mail import send_mail
        send_mail(
            subject,
            message,
            settings.DEFAULT_FROM_EMAIL,
            [settings.ADMIN_EMAIL] if hasattr(settings, 'ADMIN_EMAIL') else [],
            fail_silently=True
        )
        
        return {'status': 'success'}
    except Exception as e:
        return {'status': 'error', 'error': str(e)}


def _postgresql_restore(backup, target_db):
    """Restore PostgreSQL backup"""
    db_settings = settings.DATABASES[target_db]
    
    cmd = [
        'pg_restore',
        '-h', db_settings.get('HOST', 'localhost'),
        '-p', str(db_settings.get('PORT', 5432)),
        '-U', db_settings['USER'],
        '-d', db_settings['NAME'],
        '--clean',  # Drop objects before recreating
        '--if-exists',
        backup.file_path
    ]
    
    env = os.environ.copy()
    env['PGPASSWORD'] = db_settings['PASSWORD']
    
    process = subprocess.Popen(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, env=env)
    stdout, stderr = process.communicate()
    
    if process.returncode != 0:
        raise Exception(f"pg_restore failed: {stderr.decode()}")
    
    return True


def _mysql_restore(backup, target_db):
    """Restore MySQL backup"""
    db_settings = settings.DATABASES[target_db]
    
    # Gunzip if compressed
    if backup.filename.endswith('.gz'):
        import gzip
        with gzip.open(backup.file_path, 'rb') as f_in:
            content = f_in.read()
    else:
        with open(backup.file_path, 'rb') as f_in:
            content = f_in.read()
    
    cmd = [
        'mysql',
        '-h', db_settings.get('HOST', 'localhost'),
        '-P', str(db_settings.get('PORT', 3306)),
        '-u', db_settings['USER'],
        f'-p{db_settings["PASSWORD"]}',
        db_settings['NAME']
    ]
    
    process = subprocess.Popen(cmd, stdin=subprocess.PIPE, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    stdout, stderr = process.communicate(input=content)
    
    if process.returncode != 0:
        raise Exception(f"mysql restore failed: {stderr.decode()}")
    
    return True


def _sqlite_restore(backup, target_db):
    """Restore SQLite backup"""
    db_path = settings.DATABASES[target_db]['NAME']
    
    # Gunzip if compressed
    if backup.filename.endswith('.gz'):
        import gzip
        with gzip.open(backup.file_path, 'rb') as f_in:
            with open(db_path, 'wb') as f_out:
                f_out.write(f_in.read())
    else:
        shutil.copy2(backup.file_path, db_path)
    
    return True