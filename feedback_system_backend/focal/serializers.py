from rest_framework import serializers
from .models import Focal
from branch.models import Branch
from customer.models import Customer


class FocalSerializer(serializers.ModelSerializer):

    branch_name = serializers.ReadOnlyField(source="branch.name")

    class Meta:
        model = Focal
        fields = [
            "id",
            "branch",
            "branch_name",
            "first_name",
            "middle_name",
            "last_name",
            "gender",
            "phone_number",
            "email",
            "status",
            "description"
        ]



class FocalDropdownSerializer(serializers.ModelSerializer):

    full_name = serializers.SerializerMethodField()

    class Meta:
        model = Focal
        fields = ["id", "full_name"]

    def get_full_name(self, obj):
        return f"{obj.first_name} {obj.middle_name} {obj.last_name}".strip()



class CustomerListSerializer(serializers.ModelSerializer):

    full_name = serializers.SerializerMethodField()

    class Meta:
        model = Customer
        fields = ["id", "full_name", "phone_number"]

    def get_full_name(self, obj):
        return f"{obj.first_name} {obj.middle_name} {obj.last_name}".strip()