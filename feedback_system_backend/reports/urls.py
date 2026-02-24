from django.urls import path
from . import views

urlpatterns = [
    # Report endpoints only
    path('reports/daily/', views.DailyReportView.as_view(), name='daily-reports'),
    path('reports/weekly/', views.WeeklyReportView.as_view(), name='weekly-reports'),
    path('reports/monthly/', views.MonthlyReportView.as_view(), name='monthly-reports'),
    path('reports/yearly/', views.YearlyReportView.as_view(), name='yearly-reports'),
]