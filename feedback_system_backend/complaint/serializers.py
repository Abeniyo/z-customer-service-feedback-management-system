from rest_framework import serializers
from .models import Complaint


class ComplaintSerializer(serializers.ModelSerializer):

    class Meta:
        model = Complaint
        fields = [
            "id",
            "feedback",
            "description",
            "created_at",
            "updated_at",
            "is_deleted"
        ]
        read_only_fields = ["created_at", "updated_at"]
