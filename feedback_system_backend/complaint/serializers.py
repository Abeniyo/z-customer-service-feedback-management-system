from rest_framework import serializers
from .models import Complaint

# importing models from other apps (only reading them)
from branch.models import Branch
from focal.models import Focal
from customer.models import Customer
from feedback.models import Feedback


class ComplaintSerializer(serializers.ModelSerializer):

    customer_name = serializers.SerializerMethodField()
    focal_name = serializers.SerializerMethodField()
    branch_name = serializers.SerializerMethodField()

    class Meta:
        model = Complaint
        fields = [
            "id",
            "customer",
            "customer_name",
            "focal_name",
            "branch_name",
            "description",
            "created_at",
            "updated_at"
        ]
    def get_customer_name(self, obj):
        c = obj.customer
        return f"{c.first_name} {c.middle_name} {c.last_name}".strip()

    def get_focal_name(self, obj):
        f = obj.customer.focal
        return f"{f.first_name} {f.middle_name} {f.last_name}".strip()

    def get_branch_name(self, obj):
        return obj.customer.focal.branch.name

class BranchSearchSerializer(serializers.ModelSerializer):

    class Meta:
        model = Branch
        fields = ["id", "name"]


class FocalSearchSerializer(serializers.ModelSerializer):

    full_name = serializers.SerializerMethodField()

    class Meta:
        model = Focal
        fields = ["id", "full_name"]

    def get_full_name(self, obj):
        return f"{obj.first_name} {obj.middle_name} {obj.last_name}".strip()


class CustomerSearchSerializer(serializers.ModelSerializer):
    label = serializers.SerializerMethodField()
    value = serializers.IntegerField(source="id")  # the ID for the dropdown

    class Meta:
        model = Customer
        fields = ["value", "label"]

    def get_label(self, obj):
        return f"{obj.first_name} {obj.middle_name} {obj.last_name}".strip()

# class FeedbackSearchSerializer(serializers.ModelSerializer):

#     class Meta:
#         model = Feedback
#         fields = ["id", "customer", "created_at"]