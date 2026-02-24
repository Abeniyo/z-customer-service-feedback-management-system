from rest_framework import serializers
from .models import Focal,CustomerFocal
from customer.models import Customer
class FocalSerializer(serializers.ModelSerializer):

    branch_name = serializers.ReadOnlyField(source="branch.name")

    class Meta:
        model = Focal
        fields = "__all__"








class FocalListSerializer(serializers.ModelSerializer):

    class Meta:
        model = Focal
        fields = ["id", "first_name", "middle_name", "last_name"]



class CustomerListSerializer(serializers.ModelSerializer):

    class Meta:
        model = Customer
        fields = ["id", "first_name", "middle_name", "last_name", "phone_number"]



class CustomerFocalSerializer(serializers.ModelSerializer):

    class Meta:
        model = CustomerFocal
        fields = ["id", "customer", "focal", "created_at"]
        read_only_fields = ["created_at"]