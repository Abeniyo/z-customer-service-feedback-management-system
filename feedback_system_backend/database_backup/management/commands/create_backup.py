from django.core.management.base import BaseCommand
from database_backup.models import DatabaseBackup, BackupSchedule
from database_backup.utils import perform_backup
from django.utils import timezone
import uuid

class Command(BaseCommand):
    help = 'Create a database backup'
    
    def add_arguments(self, parser):
        parser.add_argument('--schedule', type=str, help='Schedule ID')
        parser.add_argument('--type', type=str, default='full', choices=['full', 'incremental', 'transaction_log'])
        parser.add_argument('--destination', type=str, default='local')
    
    def handle(self, *args, **options):
        schedule = None
        if options['schedule']:
            try:
                schedule = BackupSchedule.objects.get(id=options['schedule'])
            except BackupSchedule.DoesNotExist:
                self.stdout.write(self.style.ERROR(f"Schedule {options['schedule']} not found"))
                return
        
        backup = DatabaseBackup.objects.create(
            schedule=schedule,
            name=f"manual_backup_{timezone.now().strftime('%Y%m%d_%H%M%S')}",
            backup_type=options['type'],
            status='pending',
            location_type=options['destination'],
            compression_enabled=True,
            encryption_enabled=True,
        )
        
        self.stdout.write(f"Starting backup {backup.id}")
        result = perform_backup(backup)
        
        if result['success']:
            backup.status = 'success'
            backup.completed_at = timezone.now()
            backup.save()
            self.stdout.write(self.style.SUCCESS(f"Backup completed: {result['size_human']}"))
        else:
            backup.status = 'failed'
            backup.error_message = result.get('error', 'Unknown error')
            backup.save()
            self.stdout.write(self.style.ERROR(f"Backup failed: {result.get('error')}"))