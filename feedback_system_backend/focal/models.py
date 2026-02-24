from django.db import models
from branch.models import Branch
from role.models import Role
from customer.models import Customer



class Focal(models.Model):

    GENDER_CHOICES = (
        ("male", "Male"),
        ("female", "Female"),
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
    description = models.TextField(blank=True)

    def __str__(self):
        return f"{self.first_name} {self.last_name}"








class CustomerFocal(models.Model):
    customer = models.ForeignKey(
        Customer,
        on_delete=models.CASCADE,
        related_name="customer_focals"
    )
    focal = models.ForeignKey(
        Focal,
        on_delete=models.CASCADE,
        related_name="customer_focals"
    )

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "customer_focal"
        unique_together = ("customer", "focal")

    def __str__(self):
        return f"{self.customer} - {self.focal}"