from django.urls import path
from .views import (
    AdminDashboardView,
    AdminUserListView,
    ToggleUserStatusView,
    AdminContentView,
    AdminAnalyticsView,
    AdminSettingsView,
)

urlpatterns = [
    path("dashboard/", AdminDashboardView.as_view()),
    path("users/", AdminUserListView.as_view()),
    path("users/<int:pk>/toggle/", ToggleUserStatusView.as_view()),
    path("content/", AdminContentView.as_view()),
    path("analytics/", AdminAnalyticsView.as_view()),
    path("settings/", AdminSettingsView.as_view()),
]

from .views import AdminUserDetailView

urlpatterns += [
    path("users/<int:pk>/", AdminUserDetailView.as_view()),
]