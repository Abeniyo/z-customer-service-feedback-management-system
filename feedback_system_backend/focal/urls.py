from django.urls import path
from rest_framework.routers import DefaultRouter


from .views import (
    FocalViewSet,
    FocalDropdownView,
    FocalCustomersView
)

router = DefaultRouter()
router.register(r"focals", FocalViewSet, basename="focal")

urlpatterns = router.urls + [

    path(
        "focals/dropdown/",
        FocalDropdownView.as_view(),
        name="focal-dropdown"
    ),

    path(
        "focals/<int:focal_id>/customers/",
        FocalCustomersView.as_view(),
        name="focal-customers"
    ),
]