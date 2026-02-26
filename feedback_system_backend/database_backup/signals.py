from django.db.models.signals import post_save, pre_delete
from django.dispatch import receiver
from django.utils import timezone
from .models import DatabaseBackup, BackupLog, BackupSchedule

@receiver(post_save, sender=DatabaseBackup)
def backup_post_save(sender, instance, created, **kwargs):
    """Handle post-save events for backups"""
    if created:
        BackupLog.objects.create(
            backup=instance,
            schedule=instance.schedule,
            level='info',
            message=f"Backup record created"
        )

@receiver(pre_delete, sender=DatabaseBackup)
def backup_pre_delete(sender, instance, **kwargs):
    """Handle pre-delete events for backups"""
    BackupLog.objects.create(
        backup=instance,
        schedule=instance.schedule,
        level='warning',
        message=f"Backup record being deleted"
    )

@receiver(post_save, sender=BackupSchedule)
def schedule_post_save(sender, instance, created, **kwargs):
    """Handle post-save events for schedules"""
    if created:
        BackupLog.objects.create(
            schedule=instance,
            level='info',
            message=f"Backup schedule created: {instance.name}"
        )