from django.db import models
from branch.models import Branch


class Focal(models.Model):

    GENDER_CHOICES = (
        ("male", "Male"),
        ("female", "Female"),
    )

    STATUS_CHOICES = (
        ("active", "Active"),
        ("inactive", "Inactive"),
    )

    branch = models.ForeignKey(
        Branch,
        on_delete=models.CASCADE,
        related_name="focals"
    )

    first_name = models.CharField(max_length=100)
    middle_name = models.CharField(max_length=100, blank=True)
    last_name = models.CharField(max_length=100)

    gender = models.CharField(max_length=10, choices=GENDER_CHOICES)

    phone_number = models.CharField(max_length=20)
    email = models.EmailField(blank=True)

    status = models.CharField(
        max_length=10,
        choices=STATUS_CHOICES,
        default="active"
    )

    description = models.TextField(blank=True)

    def __str__(self):
        return f"{self.first_name} {self.middle_name} {self.last_name}".strip()