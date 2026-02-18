from django.db import models
from django.conf import settings
from complaint.models import Complaint
class ActionTaken(models.Model):

    complaint = models.ForeignKey(Complaint, on_delete=models.CASCADE)
    call_center = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)

    action_description = models.TextField()
    action_date = models.DateTimeField()
