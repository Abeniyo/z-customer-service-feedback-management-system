import os
import subprocess
import hashlib
import gzip
import shutil
import json
from datetime import datetime
from django.conf import settings
from django.utils import timezone
import humanize

try:
    import boto3
    from botocore.exceptions import ClientError
    BOTO_AVAILABLE = True
except ImportError:
    BOTO_AVAILABLE = False

def perform_backup(backup):
    """Perform actual database backup"""
    result = {
        'success': False,
        'file_path': None,
        'size_bytes': 0,
        'size_human': '0 B',
        'checksum': None,
        'error': None
    }
    
    try:
        # Generate filename
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        filename = f"{backup.backup_type}_backup_{timestamp}.sql"
        
        if backup.compression_enabled:
            filename += '.gz'
        
        backup.filename = filename
        
        # Set backup path based on destination
        if backup.location_type == 'local':
            backup_dir = os.path.join(settings.BACKUP_ROOT, str(backup.created_at.date()))
            os.makedirs(backup_dir, exist_ok=True)
            filepath = os.path.join(backup_dir, filename)
        else:
            # For cloud, use temp file first
            backup_dir = os.path.join('/tmp', 'db_backups', str(backup.created_at.date()))
            os.makedirs(backup_dir, exist_ok=True)
            filepath = os.path.join(backup_dir, filename)
        
        backup.file_path = filepath
        backup.save()
        
        # Perform database-specific backup
        db_engine = settings.DATABASES['default']['ENGINE']
        
        if 'postgresql' in db_engine:
            result = _postgresql_backup(backup, filepath)
        elif 'mysql' in db_engine:
            result = _mysql_backup(backup, filepath)
        elif 'sqlite3' in db_engine:
            result = _sqlite_backup(backup, filepath)
        else:
            raise Exception(f"Unsupported database engine: {db_engine}")
        
        # Calculate checksum
        if result['success'] and os.path.exists(result['file_path']):
            sha256 = hashlib.sha256()
            with open(result['file_path'], 'rb') as f:
                for chunk in iter(lambda: f.read(4096), b''):
                    sha256.update(chunk)
            result['checksum'] = sha256.hexdigest()
            
            # Upload to cloud if needed
            if backup.location_type in ['s3', 'both', 'cold'] and BOTO_AVAILABLE:
                _upload_to_s3(backup, result['file_path'])
            
            # If both local and cloud, keep local copy
            if backup.location_type == 'both':
                # Already have local copy
                pass
            elif backup.location_type in ['s3', 'cold']:
                # Remove temp file after upload
                if os.path.exists(result['file_path']):
                    os.remove(result['file_path'])
        
        return result
        
    except Exception as e:
        result['error'] = str(e)
        return result

def _postgresql_backup(backup, filepath):
    """PostgreSQL backup using pg_dump"""
    result = {'success': False, 'file_path': filepath}
    
    db_settings = settings.DATABASES['default']
    
    # Build pg_dump command
    cmd = [
        'pg_dump',
        '-h', db_settings.get('HOST', 'localhost'),
        '-p', str(db_settings.get('PORT', 5432)),
        '-U', db_settings['USER'],
        '-d', db_settings['NAME'],
        '-Fc'  # Custom format (compressed)
    ]
    
    # Set password environment variable
    env = os.environ.copy()
    env['PGPASSWORD'] = db_settings['PASSWORD']
    
    # Execute dump
    with open(filepath, 'wb') as f:
        process = subprocess.Popen(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, env=env)
        stdout, stderr = process.communicate()
        
        if process.returncode == 0:
            f.write(stdout)
            result['success'] = True
            result['size_bytes'] = os.path.getsize(filepath)
            result['size_human'] = humanize.naturalsize(result['size_bytes'])
            
            # Create log entry
            from .models import BackupLog
            BackupLog.objects.create(
                backup=backup,
                level='info',
                message=f"PostgreSQL backup completed: {result['size_human']}"
            )
        else:
            error_msg = stderr.decode()
            raise Exception(f"pg_dump failed: {error_msg}")
    
    return result

def _mysql_backup(backup, filepath):
    """MySQL backup using mysqldump"""
    result = {'success': False, 'file_path': filepath}
    
    db_settings = settings.DATABASES['default']
    
    cmd = [
        'mysqldump',
        '-h', db_settings.get('HOST', 'localhost'),
        '-P', str(db_settings.get('PORT', 3306)),
        '-u', db_settings['USER'],
        f'-p{db_settings["PASSWORD"]}',
        db_settings['NAME']
    ]
    
    with open(filepath, 'wb') as f:
        process = subprocess.Popen(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        stdout, stderr = process.communicate()
        
        if process.returncode == 0:
            if backup.compression_enabled:
                # Compress
                with gzip.open(filepath, 'wb') as gz:
                    gz.write(stdout)
            else:
                f.write(stdout)
            
            result['success'] = True
            result['size_bytes'] = os.path.getsize(filepath)
            result['size_human'] = humanize.naturalsize(result['size_bytes'])
            
            # Create log entry
            from .models import BackupLog
            BackupLog.objects.create(
                backup=backup,
                level='info',
                message=f"MySQL backup completed: {result['size_human']}"
            )
        else:
            error_msg = stderr.decode()
            raise Exception(f"mysqldump failed: {error_msg}")
    
    return result

def _sqlite_backup(backup, filepath):
    """SQLite backup (simple file copy)"""
    result = {'success': False, 'file_path': filepath}
    
    db_path = settings.DATABASES['default']['NAME']
    
    if not os.path.exists(db_path):
        raise Exception(f"SQLite database not found at {db_path}")
    
    if backup.compression_enabled:
        with open(db_path, 'rb') as f_in:
            with gzip.open(filepath, 'wb') as f_out:
                shutil.copyfileobj(f_in, f_out)
    else:
        shutil.copy2(db_path, filepath)
    
    result['success'] = True
    result['size_bytes'] = os.path.getsize(filepath)
    result['size_human'] = humanize.naturalsize(result['size_bytes'])
    
    # Create log entry
    from .models import BackupLog
    BackupLog.objects.create(
        backup=backup,
        level='info',
        message=f"SQLite backup completed: {result['size_human']}"
    )
    
    return result

def _upload_to_s3(backup, filepath):
    """Upload backup to S3"""
    if not BOTO_AVAILABLE:
        from .models import BackupLog
        BackupLog.objects.create(
            backup=backup,
            level='warning',
            message="S3 upload skipped: boto3 not installed"
        )
        return False
    
    try:
        s3_client = boto3.client(
            's3',
            aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
            aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
            region_name=settings.AWS_S3_REGION_NAME
        )
        
        # Generate S3 key
        timestamp = datetime.now().strftime('%Y/%m/%d')
        s3_key = f"backups/{timestamp}/{os.path.basename(filepath)}"
        
        # Determine storage class
        storage_class = 'STANDARD'
        if backup.location_type == 'cold':
            storage_class = 'STANDARD_IA'  # or 'GLACIER' for really cold
        
        # Upload file
        extra_args = {
            'ServerSideEncryption': 'AES256' if backup.encryption_enabled else None
        }
        if storage_class:
            extra_args['StorageClass'] = storage_class
        
        # Remove None values
        extra_args = {k: v for k, v in extra_args.items() if v is not None}
        
        s3_client.upload_file(
            filepath,
            settings.AWS_STORAGE_BUCKET_NAME,
            s3_key,
            ExtraArgs=extra_args if extra_args else None
        )
        
        # Update backup with S3 info
        backup.s3_bucket = settings.AWS_STORAGE_BUCKET_NAME
        backup.s3_key = s3_key
        backup.save()
        
        # Create log entry
        from .models import BackupLog
        BackupLog.objects.create(
            backup=backup,
            level='info',
            message=f"Uploaded to S3: s3://{backup.s3_bucket}/{backup.s3_key}"
        )
        
        return True
    except ClientError as e:
        from .models import BackupLog
        BackupLog.objects.create(
            backup=backup,
            level='error',
            message=f"S3 upload failed: {str(e)}"
        )
        raise Exception(f"S3 upload failed: {str(e)}")

def verify_backup_integrity(backup):
    """Verify backup file integrity"""
    result = {
        'verified': False,
        'message': '',
        'details': {}
    }
    
    try:
        # Check if file exists
        if not os.path.exists(backup.file_path):
            result['message'] = "Backup file not found"
            return result
        
        # Check file size
        file_size = os.path.getsize(backup.file_path)
        result['details']['size'] = file_size
        result['details']['size_human'] = humanize.naturalsize(file_size)
        
        # Verify checksum if available
        if backup.checksum:
            sha256 = hashlib.sha256()
            with open(backup.file_path, 'rb') as f:
                for chunk in iter(lambda: f.read(4096), b''):
                    sha256.update(chunk)
            calculated = sha256.hexdigest()
            
            result['details']['checksum_calculated'] = calculated
            result['details']['checksum_expected'] = backup.checksum
            
            if calculated == backup.checksum:
                result['verified'] = True
                result['message'] = "Checksum verification passed"
            else:
                result['message'] = "Checksum verification failed"
        else:
            # Just check if file is readable
            with open(backup.file_path, 'rb') as f:
                f.read(1024)  # Try to read first 1KB
            result['verified'] = True
            result['message'] = "File is readable"
        
        return result
        
    except Exception as e:
        result['message'] = f"Verification failed: {str(e)}"
        return result

def calculate_next_run(schedule):
    """Calculate next run time for a schedule"""
    now = timezone.now()
    
    if schedule.frequency == 'continuous':
        return now + timezone.timedelta(minutes=15)
    
    elif schedule.frequency == 'hourly':
        return now + timezone.timedelta(hours=1)
    
    elif schedule.frequency == 'daily':
        if schedule.scheduled_time:
            next_run = now.replace(
                hour=schedule.scheduled_time.hour,
                minute=schedule.scheduled_time.minute,
                second=0,
                microsecond=0
            )
            if next_run <= now:
                next_run += timezone.timedelta(days=1)
            return next_run
    
    elif schedule.frequency == 'weekly':
        if schedule.scheduled_day is not None and schedule.scheduled_time:
            days_ahead = schedule.scheduled_day - now.weekday()
            if days_ahead <= 0:
                days_ahead += 7
            
            next_run = now + timezone.timedelta(days=days_ahead)
            next_run = next_run.replace(
                hour=schedule.scheduled_time.hour,
                minute=schedule.scheduled_time.minute,
                second=0,
                microsecond=0
            )
            return next_run
    
    elif schedule.frequency == 'monthly':
        if schedule.scheduled_day and schedule.scheduled_time:
            year = now.year
            month = now.month
            
            # Try current month
            try:
                next_run = now.replace(
                    day=min(schedule.scheduled_day, 28),  # Avoid invalid dates
                    hour=schedule.scheduled_time.hour,
                    minute=schedule.scheduled_time.minute,
                    second=0,
                    microsecond=0
                )
                if next_run <= now:
                    # Move to next month
                    if month == 12:
                        year += 1
                        month = 1
                    else:
                        month += 1
                    next_run = next_run.replace(year=year, month=month)
                return next_run
            except ValueError:
                # Handle invalid date (e.g., Feb 30)
                next_run = now + timezone.timedelta(days=30)
                return next_run
    
    return None