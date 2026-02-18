from rest_framework import serializers
from .models import ActionTaken


class ActionTakenSerializer(serializers.ModelSerializer):

    class Meta:
        model = ActionTaken
        fields = [
            "id",
            "complaint",
            "call_center",
            "action_description",
            "action_date"
        ]
