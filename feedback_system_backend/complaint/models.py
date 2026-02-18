from django.db import models
from feedback.models import Feedback
class Complaint(models.Model):

    feedback = models.ForeignKey(Feedback, on_delete=models.CASCADE)
    description = models.TextField()

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_deleted = models.BooleanField(default=False)
