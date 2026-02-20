from rest_framework.routers import DefaultRouter
from .views import FocalViewSet

router = DefaultRouter()
router.register(r"", FocalViewSet, basename="focal")

urlpatterns = router.urls