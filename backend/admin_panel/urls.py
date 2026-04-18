from django.urls import path
from .views import (
    AdminDashboardView,
    AdminUserListView,
    ToggleUserStatusView
)

urlpatterns = [
    path("dashboard/", AdminDashboardView.as_view()),
    path("users/", AdminUserListView.as_view()),
    path("users/<int:pk>/toggle/", ToggleUserStatusView.as_view()),
]