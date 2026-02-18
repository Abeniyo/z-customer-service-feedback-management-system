from rest_framework.routers import DefaultRouter
from .views import ActionTakenViewSet

router = DefaultRouter()
router.register(r'actions', ActionTakenViewSet)

urlpatterns = router.urls
