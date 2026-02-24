from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import (
    FocalViewSet,
    FocalListView,
    FocalCustomersView,
    AssignCustomerToFocalView,
)

router = DefaultRouter()
router.register(r"", FocalViewSet, basename="focal")

urlpatterns = router.urls + [
    path("focals/", FocalListView.as_view(), name="focal-list"),
    path("focals/<int:focal_id>/customers/", FocalCustomersView.as_view(), name="focal-customers"),
    path("assign/", AssignCustomerToFocalView.as_view(), name="assign-customer-focal"),
]