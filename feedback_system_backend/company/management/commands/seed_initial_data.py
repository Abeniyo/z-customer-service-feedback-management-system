from django.core.management.base import BaseCommand
from django.db import transaction

from company.models import Company
from branch.models import Branch
from role.models import Role


class Command(BaseCommand):
    help = "Seed initial system data for Gebeta"

    @transaction.atomic
    def handle(self, *args, **kwargs):

        # 1️⃣ Create Company
        company, _ = Company.objects.get_or_create(
            name="Gebeta",
            defaults={"description": "Gebeta PLC at Hawassa Branch"}
        )

        # 2️⃣ Create Branches
        branches = [
            "Alliance Branch",
            "Atote Branch"
        ]

        for branch_name in branches:
            Branch.objects.get_or_create(
                name=branch_name,
                company=company,
                defaults={
                    "location": "Addis Ababa"
                }
            )

        # 3️⃣ Create Roles
        roles = [
            {"name": "Call Center", "code": "CALL_CENTER"},
            {"name": "Branch Manager", "code": "BRANCH_MANAGER"},
            {"name": "Admin", "code": "ADMIN"},
            {"name": "System Admin", "code": "SYSTEM_ADMIN"},
        ]

        for role in roles:
            Role.objects.get_or_create(
                code=role["code"],
                defaults={
                    "name": role["name"],
                    "description": f"{role['name']} role"
                }
            )

        self.stdout.write(self.style.SUCCESS("✅ Gebeta initial data seeded successfully!"))