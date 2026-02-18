from rest_framework.viewsets import ModelViewSet
from .models import CallInteraction
from .serializers import CallInteractionSerializer

class CallInteractionViewSet(ModelViewSet):
    queryset = CallInteraction.objects.filter(is_deleted=False)
    serializer_class = CallInteractionSerializer
    filterset_fields = "__all__"
    search_fields = ["call_status"]
    ordering_fields = "__all__"
