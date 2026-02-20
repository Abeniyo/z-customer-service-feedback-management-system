from rest_framework.viewsets import ModelViewSet
from .models import Role
from .serializers import RoleSerializer


class RoleViewSet(ModelViewSet):
    queryset = Role.objects.all()
    serializer_class = RoleSerializer
    filterset_fields = ["name"]
    search_fields = ["name"]
    ordering_fields = ["id", "name"]