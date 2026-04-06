from django.urls import path
from .views import ConnectSourceView, IntegrationDeleteView, IntegrationListView, IntegrationSyncView

urlpatterns = [
    path("connect/", ConnectSourceView.as_view()),
    path("<str:source>/sync/", IntegrationSyncView.as_view()),
    path("", IntegrationListView.as_view()),
    path("<str:source>/disconnect/", IntegrationDeleteView.as_view()),
]   