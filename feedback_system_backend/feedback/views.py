from rest_framework.viewsets import ModelViewSet
from .models import Feedback
from .serializers import FeedbackSerializer
class FeedbackViewSet(ModelViewSet):

    queryset = Feedback.objects.filter(is_deleted=False)
    serializer_class = FeedbackSerializer

    filterset_fields = "__all__"
    search_fields = ["satisfaction_level"]
    ordering_fields = "__all__"
