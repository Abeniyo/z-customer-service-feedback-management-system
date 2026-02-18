from django.core.management.base import BaseCommand
from organization.models import Branch

class Command(BaseCommand):
    def handle(self, *args, **kwargs):
        Branch.objects.get_or_create(
            name="first_branch",
            location="Hawasa, Circle",
            description="This is the system default"
        )
        self.stdout.write("Default branch created.")
