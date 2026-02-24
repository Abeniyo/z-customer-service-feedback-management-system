from rest_framework.viewsets import ModelViewSet
from .models import Focal
from .serializers import FocalSerializer


class FocalViewSet(ModelViewSet):
    queryset = Focal.objects.all().order_by("id")
    serializer_class = FocalSerializer
    filterset_fields = ["branch", "gender"]
    search_fields = ["first_name", "last_name"]
    ordering_fields = ["id", "first_name"]






from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404

from focal.models import Focal
from customer.models import Customer
from .models import Focal
from .serializers import (
    FocalListSerializer,
    CustomerListSerializer,
    CustomerFocalSerializer
)



class FocalListView(APIView):

    def get(self, request):
        focals = Focal.objects.all()
        serializer = FocalListSerializer(focals, many=True)
        return Response(serializer.data)



class FocalCustomersView(APIView):

    def get(self, request, focal_id):
        focal = get_object_or_404(Focal, id=focal_id)

        customers = Customer.objects.filter(
            customer_focals__focal=focal,
            is_deleted=False
        )

        serializer = CustomerListSerializer(customers, many=True)
        return Response({
            "focal": f"{focal.first_name} {focal.middle_name} {focal.last_name}".strip(),
            "customers": serializer.data
        })



class AssignCustomerToFocalView(APIView):

    def post(self, request):
        serializer = CustomerFocalSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)