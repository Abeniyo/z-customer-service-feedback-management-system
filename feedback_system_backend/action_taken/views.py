from rest_framework.viewsets import ModelViewSet
from .models import ActionTaken
from .serializers import ActionTakenSerializer


class ActionTakenViewSet(ModelViewSet):

    queryset = ActionTaken.objects.all()
    serializer_class = ActionTakenSerializer

    filterset_fields = "__all__"
    search_fields = ["action_description"]
    ordering_fields = "__all__"

    def perform_create(self, serializer):
        serializer.save(call_center=self.request.user)
