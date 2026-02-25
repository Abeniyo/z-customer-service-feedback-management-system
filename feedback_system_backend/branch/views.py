from rest_framework.viewsets import ModelViewSet
from .models import Branch
from .serializers import BranchSerializer


class BranchViewSet(ModelViewSet):
    queryset = Branch.objects.select_related("company", "branch_manager")
    serializer_class = BranchSerializer
    filterset_fields = ["company", "location"]
    search_fields = ["name", "location"]
    ordering_fields = ["id", "name"]