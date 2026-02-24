from rest_framework import serializers


# ==============================
# DAILY REPORT
# ==============================

class DailyReportSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    date = serializers.DateField()
    day = serializers.CharField()
    total_calls = serializers.IntegerField()
    resolved = serializers.IntegerField()
    pending = serializers.IntegerField()
    escalated = serializers.IntegerField()
    average_rating = serializers.FloatField()
    satisfaction_rate = serializers.FloatField()
    average_time = serializers.CharField()

    calls = serializers.ListField(child=serializers.DictField())
    agent_performance = serializers.ListField(child=serializers.DictField())
    peak_hours = serializers.ListField(child=serializers.DictField())

    class Meta:
        ref_name = "DailyReport"


# ==============================
# WEEKLY REPORT
# ==============================

class WeeklyReportSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    week = serializers.CharField()
    start_date = serializers.DateField()
    end_date = serializers.DateField()
    total_calls = serializers.IntegerField()
    resolved = serializers.IntegerField()
    pending = serializers.IntegerField()
    escalated = serializers.IntegerField()
    average_rating = serializers.FloatField()
    satisfaction_rate = serializers.FloatField()
    trend = serializers.CharField()
    best_day = serializers.CharField()
    worst_day = serializers.CharField()

    daily_breakdown = serializers.ListField(child=serializers.DictField())
    top_agents = serializers.ListField(child=serializers.DictField())

    class Meta:
        ref_name = "WeeklyReport"


# ==============================
# MONTHLY REPORT
# ==============================

class MonthlyReportSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    month = serializers.CharField()
    total_calls = serializers.IntegerField()
    resolved = serializers.IntegerField()
    pending = serializers.IntegerField()
    escalated = serializers.IntegerField()
    average_rating = serializers.FloatField()
    satisfaction_rate = serializers.FloatField()
    trend = serializers.CharField()
    best_agent = serializers.CharField()

    weekly_breakdown = serializers.ListField(child=serializers.DictField())
    agent_rankings = serializers.ListField(child=serializers.DictField())

    class Meta:
        ref_name = "MonthlyReport"


# ==============================
# YEARLY REPORT
# ==============================

class YearlyReportSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    year = serializers.CharField()
    total_calls = serializers.IntegerField()
    resolved = serializers.IntegerField()
    average_rating = serializers.FloatField()
    satisfaction_rate = serializers.FloatField()
    growth = serializers.CharField()

    monthly_breakdown = serializers.ListField(child=serializers.DictField())
    quarterly_breakdown = serializers.ListField(child=serializers.DictField())
    top_performers = serializers.ListField(child=serializers.DictField())

    class Meta:
        ref_name = "YearlyReport"


# ==============================
# FILTER SERIALIZER
# ==============================

class ReportFilterSerializer(serializers.Serializer):
    start_date = serializers.DateField(required=False)
    end_date = serializers.DateField(required=False)
    agent_id = serializers.IntegerField(required=False)

    def validate(self, data):
        if data.get("start_date") and data.get("end_date"):
            if data["start_date"] > data["end_date"]:
                raise serializers.ValidationError(
                    "Start date must be before end date"
                )
        return data