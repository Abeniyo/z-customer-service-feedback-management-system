from django.db import models
from django.conf import settings

class CallInteraction(models.Model):

    CALL_STATUS = (
        ('open', 'Open'),
        ('closed', 'Closed'),
    )

    customer = models.ForeignKey('customer.Customer', on_delete=models.CASCADE)
    call_center = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)

    call_date = models.DateTimeField()
    call_status = models.CharField(max_length=20, choices=CALL_STATUS)
    receipt_given = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_deleted = models.BooleanField(default=False)
