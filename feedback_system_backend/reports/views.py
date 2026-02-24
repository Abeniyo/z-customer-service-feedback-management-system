from rest_framework.views import APIView
from rest_framework.response import Response
from django.utils import timezone
from django.db.models import Count, Q
from datetime import timedelta, datetime
import calendar

from call_interaction.models import CallInteraction
from feedback.models import Feedback
from django.contrib.auth import get_user_model

from .serializers import (
    DailyReportSerializer,
    WeeklyReportSerializer,
    MonthlyReportSerializer,
    YearlyReportSerializer,
    ReportFilterSerializer
)

User = get_user_model()


# ======================================================
# DAILY REPORT
# ======================================================

class DailyReportView(APIView):

    def get(self, request):
        filters = ReportFilterSerializer(data=request.query_params)
        filters.is_valid(raise_exception=True)
        data = filters.validated_data

        end_date = data.get("end_date", timezone.now().date())
        start_date = data.get("start_date", end_date - timedelta(days=6))

        reports = []
        current = start_date
        rid = 1

        while current <= end_date:

            calls = CallInteraction.objects.filter(
                call_date__date=current,
                is_deleted=False
            )

            if data.get("agent_id"):
                calls = calls.filter(call_center_id=data["agent_id"])

            total = calls.count()
            resolved = calls.filter(call_status="closed").count()
            pending = calls.filter(call_status="open").count()

            feedbacks = Feedback.objects.filter(
                call_interaction__in=calls,
                is_deleted=False
            )

            avg_rating = 0
            if feedbacks.exists():
                rating_map = {"good": 5, "neutral": 3, "bad": 1}
                total_rating = sum(
                    rating_map.get(f.satisfaction_level, 0)
                    for f in feedbacks
                )
                avg_rating = total_rating / feedbacks.count()

            reports.append({
                "id": rid,
                "date": current,
                "day": calendar.day_name[current.weekday()],
                "total_calls": total,
                "resolved": resolved,
                "pending": pending,
                "escalated": 0,
                "average_rating": round(avg_rating, 1),
                "satisfaction_rate":
                    round((resolved / total * 100), 1) if total > 0 else 0,
                "average_time": "N/A",
                "calls": [],
                "agent_performance": [],
                "peak_hours": []
            })

            current += timedelta(days=1)
            rid += 1

        serializer = DailyReportSerializer(reports, many=True)
        return Response(serializer.data)


# ======================================================
# WEEKLY REPORT
# ======================================================

class WeeklyReportView(APIView):

    def get(self, request):
        filters = ReportFilterSerializer(data=request.query_params)
        filters.is_valid(raise_exception=True)
        data = filters.validated_data

        end_date = data.get("end_date", timezone.now().date())
        start_date = data.get("start_date", end_date - timedelta(weeks=4))

        reports = []
        current = start_date
        rid = 1

        while current <= end_date:

            week_end = min(current + timedelta(days=6), end_date)

            calls = CallInteraction.objects.filter(
                call_date__date__gte=current,
                call_date__date__lte=week_end,
                is_deleted=False
            )

            if data.get("agent_id"):
                calls = calls.filter(call_center_id=data["agent_id"])

            total = calls.count()
            resolved = calls.filter(call_status="closed").count()
            pending = calls.filter(call_status="open").count()

            reports.append({
                "id": rid,
                "week": f"Week {current.isocalendar()[1]}",
                "start_date": current,
                "end_date": week_end,
                "total_calls": total,
                "resolved": resolved,
                "pending": pending,
                "escalated": 0,
                "average_rating": 0,
                "satisfaction_rate":
                    round((resolved / total * 100), 1) if total > 0 else 0,
                "trend": "0%",
                "best_day": "N/A",
                "worst_day": "N/A",
                "daily_breakdown": [],
                "top_agents": []
            })

            current += timedelta(weeks=1)
            rid += 1

        serializer = WeeklyReportSerializer(reports, many=True)
        return Response(serializer.data)


# ======================================================
# MONTHLY REPORT
# ======================================================

class MonthlyReportView(APIView):

    def get(self, request):
        filters = ReportFilterSerializer(data=request.query_params)
        filters.is_valid(raise_exception=True)
        data = filters.validated_data

        end_date = data.get("end_date", timezone.now().date())
        start_date = data.get("start_date", end_date - timedelta(days=180))

        reports = []
        current = start_date.replace(day=1)
        rid = 1

        while current <= end_date:

            month_end = (
                current.replace(month=current.month % 12 + 1, day=1)
                - timedelta(days=1)
            )

            month_end = min(month_end, end_date)

            calls = CallInteraction.objects.filter(
                call_date__date__gte=current,
                call_date__date__lte=month_end,
                is_deleted=False
            )

            if data.get("agent_id"):
                calls = calls.filter(call_center_id=data["agent_id"])

            total = calls.count()
            resolved = calls.filter(call_status="closed").count()
            pending = calls.filter(call_status="open").count()

            reports.append({
                "id": rid,
                "month": current.strftime("%B %Y"),
                "total_calls": total,
                "resolved": resolved,
                "pending": pending,
                "escalated": 0,
                "average_rating": 0,
                "satisfaction_rate":
                    round((resolved / total * 100), 1) if total > 0 else 0,
                "trend": "0%",
                "best_agent": "N/A",
                "weekly_breakdown": [],
                "agent_rankings": []
            })

            current = (current + timedelta(days=32)).replace(day=1)
            rid += 1

        serializer = MonthlyReportSerializer(reports, many=True)
        return Response(serializer.data)


# ======================================================
# YEARLY REPORT
# ======================================================

class YearlyReportView(APIView):

    def get(self, request):
        filters = ReportFilterSerializer(data=request.query_params)
        filters.is_valid(raise_exception=True)
        data = filters.validated_data

        end_date = data.get("end_date", timezone.now().date())
        start_year = (
            data.get("start_date", end_date - timedelta(days=730)).year
        )

        reports = []
        rid = 1

        for year in range(start_year, end_date.year + 1):

            calls = CallInteraction.objects.filter(
                call_date__year=year,
                is_deleted=False
            )

            if data.get("agent_id"):
                calls = calls.filter(call_center_id=data["agent_id"])

            total = calls.count()
            resolved = calls.filter(call_status="closed").count()

            reports.append({
                "id": rid,
                "year": str(year),
                "total_calls": total,
                "resolved": resolved,
                "average_rating": 0,
                "satisfaction_rate":
                    round((resolved / total * 100), 1) if total > 0 else 0,
                "growth": "0%",
                "monthly_breakdown": [],
                "quarterly_breakdown": [],
                "top_performers": []
            })

            rid += 1

        serializer = YearlyReportSerializer(reports, many=True)
        return Response(serializer.data)