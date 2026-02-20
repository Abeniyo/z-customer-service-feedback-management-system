from django.db import models
from company.models import Company


class Branch(models.Model):
    name = models.CharField(max_length=255)
    location = models.CharField(max_length=255)
    company = models.ForeignKey(
        Company,
        on_delete=models.CASCADE,
        related_name="branches"
    )

    def __str__(self):
        return f"{self.name} - {self.company.name}"