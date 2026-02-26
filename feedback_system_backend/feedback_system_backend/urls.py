"""
URL configuration for feedback_system_backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/6.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
"""
URL configuration for feedback_system_backend project.
"""
from django.contrib import admin
from django.urls import path, include
from rest_framework.decorators import api_view
from rest_framework.reverse import reverse
from rest_framework.response import Response

urlpatterns = [
    path('admin/', admin.site.urls),
    path("api/v1/accounts/", include("accounts.urls")),
    path("api/v1/organization/", include("organization.urls")),
    path("api/v1/customers/", include("customer.urls")),
    path("api/v1/interactions/", include("call_interaction.urls")),
    path("api/v1/feedbacks/", include("feedback.urls")),
    path("api/v1/complaints/", include("complaint.urls")),
    path("api/v1/actions/", include("action_taken.urls")),
    path("api/v1/company/", include("company.urls")),
    path("api/v1/branch/", include("branch.urls")),
    path("api/v1/role/", include("role.urls")),
    path("api/v1/focal/", include("focal.urls")),
    path("api/v1/reports/", include("reports.urls")),

    # System Health URLs - use consistent versioning
    path('api/v1/system-health/', include('system_health.urls')),
    path('api/v1/database-backup/', include('database_backup.urls')),
]

# Optional: Add a global API root if you want
@api_view(['GET'])
def api_root(request, format=None):
    return Response({
        'accounts': reverse('accounts-list', request=request, format=format),
        'organization': reverse('organization-list', request=request, format=format),
        'customers': reverse('customer-list', request=request, format=format),
        'system-health': reverse('system-health-list', request=request, format=format),
    })


