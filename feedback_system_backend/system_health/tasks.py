from celery import shared_task
from .management.commands.collect_system_metrics import Command

@shared_task
def collect_metrics():
    """Run every 5 minutes to collect system metrics"""
    cmd = Command()
    cmd.handle()