from rest_framework.viewsets import ModelViewSet
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import Complaint
from .serializers import (
    ComplaintSerializer,
    BranchSearchSerializer,
    FocalSearchSerializer,
    CustomerSearchSerializer
)

from branch.models import Branch
from focal.models import Focal
from customer.models import Customer
from feedback.models import Feedback


class ComplaintViewSet(ModelViewSet):

    queryset = Complaint.objects.filter(is_deleted=False).order_by('-created_at')
    serializer_class = ComplaintSerializer

    filterset_fields = [
        "customer",
        "customer__focal",
        "customer__focal__branch"
    ]

    search_fields = [
        "description",
        "customer__first_name",
        "customer__middle_name",
        "customer__last_name",
        "customer__focal__first_name",
        "customer__focal__middle_name",
        "customer__focal__last_name",
        "customer__focal__branch__name"
    ]

    # ---------------------------
    # Search Branch
    # ---------------------------

    @action(detail=False, methods=["get"])
    def branches(self, request):

        search = request.query_params.get("search")

        branches = Branch.objects.all()

        if search:
            branches = branches.filter(name__icontains=search)

        serializer = BranchSearchSerializer(branches, many=True)
        return Response(serializer.data)

    # ---------------------------
    # Search Focal by Branch
    # ---------------------------

    @action(detail=False, methods=["get"])
    def focals(self, request):

        branch_id = request.query_params.get("branch_id")
        search = request.query_params.get("search")

        focals = Focal.objects.all()

        if branch_id:
            focals = focals.filter(branch_id=branch_id)

        if search:
            focals = focals.filter(
                first_name__icontains=search
            ) | focals.filter(
                middle_name__icontains=search
            ) | focals.filter(
                last_name__icontains=search
            )

        serializer = FocalSearchSerializer(focals, many=True)
        return Response(serializer.data)

    # ---------------------------
    # Search Customer by Focal
    # ---------------------------

    @action(detail=False, methods=["get"])
    def customers(self, request):
        focal_id = request.query_params.get("focal_id")
        search = request.query_params.get("search")

        customers = Customer.objects.all()

        if focal_id:
            customers = customers.filter(focal_id=focal_id)

        if search:
            customers = customers.filter(
                first_name__icontains=search
            ) | customers.filter(
                middle_name__icontains=search
            ) | customers.filter(
                last_name__icontains=search
            )

        serializer = CustomerSearchSerializer(customers, many=True)
        return Response(serializer.data)

    # ---------------------------
    # Feedback by Customer
    # ---------------------------

    # @action(detail=False, methods=["get"])
    # def feedbacks(self, request):

    #     customer_id = request.query_params.get("customer_id")

    #     feedbacks = Feedback.objects.all()

    #     if customer_id:
    #         feedbacks = feedbacks.filter(customer_id=customer_id)

    #     serializer = FeedbackSearchSerializer(feedbacks, many=True)
    #     return Response(serializer.data)