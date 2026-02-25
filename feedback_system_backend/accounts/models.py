from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):

    class Role(models.TextChoices):
        SYSTEM_ADMIN = "SYSTEM_ADMIN", "System Admin"
        ADMIN = "ADMIN", "Admin"
        CALL_CENTER = "CALL_CENTER", "Call Center"
        BRANCH_MANAGER = "BRANCH_MANAGER", "Branch Manager"

    role = models.CharField(
        max_length=20,
        choices=Role.choices,
        default=Role.CALL_CENTER,
    )
    branch = models.ForeignKey(
        "branch.Branch",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        default=None,
        related_name="users"
    )


    def __str__(self):
        return f"{self.username} - {self.role}"
