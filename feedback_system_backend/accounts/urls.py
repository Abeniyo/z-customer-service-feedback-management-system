from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UserManagementViewSet
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

router = DefaultRouter()
router.register(r"users", UserManagementViewSet, basename="users")

urlpatterns = [

    path("login/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("refresh/", TokenRefreshView.as_view(), name="token_refresh"),


    path("", include(router.urls)),
]
