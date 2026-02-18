from rest_framework import serializers
from .models import Feedback
from complaint.models import Complaint
from action_taken.models import ActionTaken

class FeedbackSerializer(serializers.ModelSerializer):
    class Meta:
        model = Feedback
        fields = "__all__"


class ComplaintSerializer(serializers.ModelSerializer):
    class Meta:
        model = Complaint
        fields = "__all__"


class ActionTakenSerializer(serializers.ModelSerializer):
    class Meta:
        model = ActionTaken
        fields = "__all__"
