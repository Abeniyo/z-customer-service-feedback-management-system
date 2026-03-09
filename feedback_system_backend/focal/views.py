from rest_framework.viewsets import ModelViewSet
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from rest_framework.response import Response
from customer.models import Customer

from .models import Focal

from .serializers import (
    FocalSerializer,
    FocalDropdownSerializer,
    CustomerListSerializer
)


class FocalViewSet(ModelViewSet):

    queryset = Focal.objects.all().order_by("id")
    serializer_class = FocalSerializer

    filterset_fields = ["branch", "gender", "status"]
    search_fields = ["first_name", "middle_name", "last_name"]
    ordering_fields = ["id", "first_name"]



class FocalDropdownView(APIView):

    def get(self, request):

        focals = Focal.objects.filter(status="active")

        serializer = FocalDropdownSerializer(focals, many=True)

        return Response(serializer.data)


class FocalCustomersView(APIView):

    def get(self, request, focal_id):

        focal = get_object_or_404(Focal, id=focal_id)

        customers = Customer.objects.filter(
            focal=focal,
            is_deleted=False
        )

        serializer = CustomerListSerializer(customers, many=True)

        return Response({
            "focal": str(focal),
            "customers": serializer.data
        })
