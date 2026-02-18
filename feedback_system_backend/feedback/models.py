from django.conf import settings
from django.db import models

class Feedback(models.Model):

    SATISFACTION = (
        ('good', 'Good'),
        ('neutral', 'Neutral'),
        ('bad', 'Bad'),
    )

    call_interaction = models.ForeignKey('call_interaction.CallInteraction', on_delete=models.CASCADE)
    customer = models.ForeignKey('customer.Customer', on_delete=models.CASCADE)
    call_center = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)

    satisfaction_level = models.CharField(max_length=20, choices=SATISFACTION)
    feedback_date = models.DateTimeField()

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_deleted = models.BooleanField(default=False)
