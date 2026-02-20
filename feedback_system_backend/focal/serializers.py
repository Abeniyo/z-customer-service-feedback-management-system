from rest_framework import serializers
from .models import Focal


class FocalSerializer(serializers.ModelSerializer):

    branch_name = serializers.ReadOnlyField(source="branch.name")

    class Meta:
        model = Focal
        fields = "__all__"