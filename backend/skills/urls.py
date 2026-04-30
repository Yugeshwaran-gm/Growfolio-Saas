from django.urls import path
from .views import SkillExtractionView, SkillListView, UserSkillDetailView

urlpatterns = [
    path("", SkillListView.as_view()),
    path("extract/", SkillExtractionView.as_view()),
    path("<int:pk>/", UserSkillDetailView.as_view()),
]