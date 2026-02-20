from rest_framework.viewsets import ModelViewSet
from .models import Focal
from .serializers import FocalSerializer


class FocalViewSet(ModelViewSet):
    queryset = Focal.objects.select_related("branch")
    serializer_class = FocalSerializer
    filterset_fields = ["branch", "gender"]
    search_fields = ["first_name", "last_name"]
    ordering_fields = ["id", "first_name"]