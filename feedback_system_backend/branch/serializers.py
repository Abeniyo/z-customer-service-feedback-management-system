from rest_framework import serializers
from .models import Branch


class BranchSerializer(serializers.ModelSerializer):

    company_name = serializers.ReadOnlyField(source="company.name")
    manager_first_name = serializers.ReadOnlyField(source="branch_manager.first_name")
    manager_middle_name = serializers.ReadOnlyField(source="branch_manager.middle_name")
    manager_last_name = serializers.ReadOnlyField(source="branch_manager.last_name")
    class Meta:
        model = Branch
        fields = "__all__"