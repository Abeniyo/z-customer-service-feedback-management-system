from rest_framework.viewsets import ModelViewSet
from .models import Company
from .serializers import CompanySerializer


class CompanyViewSet(ModelViewSet):
    queryset = Company.objects.all()
    serializer_class = CompanySerializer
    filterset_fields = ["name"]
    search_fields = ["name", "description"]
    ordering_fields = ["id", "name"]