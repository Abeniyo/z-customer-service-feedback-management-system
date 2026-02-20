from rest_framework import serializers
from .models import Branch


class BranchSerializer(serializers.ModelSerializer):

    company_name = serializers.ReadOnlyField(source="company.name")

    class Meta:
        model = Branch
        fields = "__all__"