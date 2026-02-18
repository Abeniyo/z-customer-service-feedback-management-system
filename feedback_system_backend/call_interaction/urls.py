from rest_framework.routers import DefaultRouter
from .views import CallInteractionViewSet

router = DefaultRouter()
router.register(r'call-interactions', CallInteractionViewSet)

urlpatterns = router.urls
