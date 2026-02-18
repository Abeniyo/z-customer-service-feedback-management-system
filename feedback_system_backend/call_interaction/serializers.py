from rest_framework import serializers
from .models import CallInteraction

class CallInteractionSerializer(serializers.ModelSerializer):
    class Meta:
        model = CallInteraction
        fields = "__all__"
