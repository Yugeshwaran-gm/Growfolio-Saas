from django.urls import path
from .views import ProfileDetailView, ProfileUpdateView

urlpatterns = [
    path('', ProfileDetailView.as_view()),
    path('update/', ProfileUpdateView.as_view()),
]