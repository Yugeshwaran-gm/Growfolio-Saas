from django.urls import path
from .views import ExploreProfilesView

urlpatterns = [
    path("profiles/", ExploreProfilesView.as_view(), name="explore-profiles"),
]