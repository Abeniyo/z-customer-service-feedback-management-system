from django.db import models


class Complaint(models.Model):

    customer = models.ForeignKey('customer.Customer', on_delete=models.CASCADE)
    description = models.TextField(blank=True, null=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_deleted = models.BooleanField(default=False)

