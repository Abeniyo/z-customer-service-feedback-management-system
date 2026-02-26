import os
import subprocess
import hashlib
import gzip
import shutil
from datetime import datetime
from django.conf import settings
import boto3
from botocore.exceptions import ClientError

def perform_backup(backup):
    """Perform actual database backup"""
    result = {
        'success': False,
        'file_path': None,
        'size_bytes': 0,
        'size_human': '0 B',
        'checksum': None
    }
    
    try:
        # Generate filename
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        filename = f"{backup.backup_type}_backup_{timestamp}.sql"
        
        if backup.compression_enabled:
            filename += '.gz'
        
        # Set backup path based on destination
        if backup.location_type == 'local':
            backup_dir = os.path.join(settings.BACKUP_ROOT, str(backup.created_at.date()))
            os.makedirs(backup_dir, exist_ok=True)
            filepath = os.path.join(backup_dir, filename)
        else:
            # For cloud, use temp file first
            backup_dir = '/tmp/db_backups'
            os.makedirs(backup_dir, exist_ok=True)
            filepath = os.path.join(backup_dir, filename)
        
        # Perform database-specific backup
        if settings.DATABASES['default']['ENGINE'].endswith('postgresql'):
            result = _postgresql_backup(backup, filepath)
        elif settings.DATABASES['default']['ENGINE'].endswith('mysql'):
            result = _mysql_backup(backup, filepath)
        elif settings.DATABASES['default']['ENGINE'].endswith('sqlite3'):
            result = _sqlite_backup(backup, filepath)
        
        # Calculate checksum
        if result['success'] and os.path.exists(result['file_path']):
            sha256 = hashlib.sha256()
            with open(result['file_path'], 'rb') as f:
                for chunk in iter(lambda: f.read(4096), b''):
                    sha256.update(chunk)
            result['checksum'] = sha256.hexdigest()
            
            # Upload to cloud if needed
            if backup.location_type in ['s3', 'both', 'cold']:
                _upload_to_s3(backup, result['file_path'])
            
            # If both local and cloud, keep local copy
            if backup.location_type == 'both':
                # Already have local copy
                pass
            elif backup.location_type in ['s3', 'cold']:
                # Remove temp file after upload
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
            result['size_human'] = _sizeof_fmt(result['size_bytes'])
        else:
            raise Exception(f"pg_dump failed: {stderr.decode()}")
    
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
            result['size_human'] = _sizeof_fmt(result['size_bytes'])
        else:
            raise Exception(f"mysqldump failed: {stderr.decode()}")
    
    return result

def _sqlite_backup(backup, filepath):
    """SQLite backup (simple file copy)"""
    result = {'success': False, 'file_path': filepath}
    
    db_path = settings.DATABASES['default']['NAME']
    
    if backup.compression_enabled:
        with open(db_path, 'rb') as f_in:
            with gzip.open(filepath, 'wb') as f_out:
                shutil.copyfileobj(f_in, f_out)
    else:
        shutil.copy2(db_path, filepath)
    
    result['success'] = True
    result['size_bytes'] = os.path.getsize(filepath)
    result['size_human'] = _sizeof_fmt(result['size_bytes'])
    
    return result

def _upload_to_s3(backup, filepath):
    """Upload backup to S3"""
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
        
        # Upload file
        s3_client.upload_file(
            filepath,
            settings.AWS_STORAGE_BUCKET_NAME,
            s3_key,
            ExtraArgs={
                'ServerSideEncryption': 'AES256' if backup.encryption_enabled else None,
                'StorageClass': 'STANDARD_IA' if backup.location_type == 'cold' else 'STANDARD'
            }
        )
        
        # Update backup with S3 info
        backup.s3_bucket = settings.AWS_STORAGE_BUCKET_NAME
        backup.s3_key = s3_key
        backup.save()
        
        return True
    except ClientError as e:
        raise Exception(f"S3 upload failed: {str(e)}")

def _sizeof_fmt(num, suffix='B'):
    """Convert bytes to human readable format"""
    for unit in ['', 'Ki', 'Mi', 'Gi', 'Ti', 'Pi', 'Ei', 'Zi']:
        if abs(num) < 1024.0:
            return f"{num:3.1f}{unit}{suffix}"
        num /= 1024.0
    return f"{num:.1f}Yi{suffix}"