from django.urls import path
from .views import ChangePasswordView, ForgotPasswordView, RegisterView, ResetPasswordView

urlpatterns = [
    path('register/', RegisterView.as_view()),
    path("forgot-password/", ForgotPasswordView.as_view()),
    path("reset-password/<str:token>/", ResetPasswordView.as_view()),
    path("change-password/", ChangePasswordView.as_view()),
]