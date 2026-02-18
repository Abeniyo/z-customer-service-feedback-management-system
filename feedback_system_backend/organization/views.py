from rest_framework.viewsets import ModelViewSet
from .models import Branch
from .serializers import BranchSerializer

class BranchViewSet(ModelViewSet):
    queryset = Branch.objects.all()
    serializer_class = BranchSerializer
    filterset_fields = "__all__"
    search_fields = ["name", "location"]
    ordering_fields = "__all__"
