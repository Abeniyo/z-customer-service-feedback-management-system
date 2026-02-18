from rest_framework.viewsets import ModelViewSet
from .models import Complaint
from .serializers import ComplaintSerializer


class ComplaintViewSet(ModelViewSet):

    queryset = Complaint.objects.filter(is_deleted=False)
    serializer_class = ComplaintSerializer

    filterset_fields = "__all__"
    search_fields = ["description"]
    ordering_fields = "__all__"
