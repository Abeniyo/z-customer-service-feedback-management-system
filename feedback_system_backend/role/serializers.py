from rest_framework import serializers
from .models import Role

class RoleSerializer(serializers.ModelSerializer):

    class Meta:
        model = Role
        fields = ["id", "name", "description"]
        read_only_fields = ["id"]

    def validate_name(self, value):
        """
        Prevent duplicate role names (case insensitive).
        """
        if Role.objects.filter(name__iexact=value).exists():
            raise serializers.ValidationError("Role with this name already exists.")
        return value