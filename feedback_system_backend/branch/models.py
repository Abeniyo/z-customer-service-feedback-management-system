from django.db import models
#from django.contrib.auth.models import User
from company.models import Company
from django.conf import settings


class Branch(models.Model):
    name = models.CharField(max_length=255)
    location = models.CharField(max_length=255)
    company = models.ForeignKey(
        Company,
        on_delete=models.CASCADE,
        related_name="branches"
    )
    branch_manager = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="managed_branch"
    )

    def __str__(self):
        return f"{self.name} - {self.company.name}"