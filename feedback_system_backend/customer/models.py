from django.db import models
from focal.models import Focal
class Customer(models.Model):

    GENDER_CHOICES = (
        ('male', 'Male'),
        ('female', 'Female')
    )

    first_name = models.CharField(max_length=100)
    middle_name = models.CharField(max_length=100, blank=True)
    last_name = models.CharField(max_length=100)
    gender = models.CharField(max_length=10, choices=GENDER_CHOICES)
    phone_number = models.CharField(max_length=20)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_deleted = models.BooleanField(default=False)

    focal = models.ForeignKey(
        Focal,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        default=1,          
        related_name="customers"
    )
    def __str__(self):
        # Return full name for browsable API dropdown
        return f"{self.first_name} {self.middle_name} {self.last_name}".strip()
