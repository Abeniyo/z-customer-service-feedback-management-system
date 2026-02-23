from rest_framework.viewsets import ModelViewSet
from .models import Customer
from .serializers import CustomerSerializer

class CustomerViewSet(ModelViewSet):
    queryset = Customer.objects.filter(is_deleted=False).order_by('-id')
    serializer_class = CustomerSerializer
    filterset_fields = '__all__'
    search_fields = ['first_name', 'phone_number']
    ordering_fields = '__all__'
