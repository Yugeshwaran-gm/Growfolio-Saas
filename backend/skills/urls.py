from django.urls import path
from .views import SkillExtractionView

urlpatterns = [
    path("extract/", SkillExtractionView.as_view())
]