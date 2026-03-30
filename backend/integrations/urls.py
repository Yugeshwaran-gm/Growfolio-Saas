from django.urls import path
from .views import ConnectSourceView, IntegrationListView, IntegrationSyncView

urlpatterns = [
    path("connect/", ConnectSourceView.as_view()),
    path("<str:source>/sync/", IntegrationSyncView.as_view()),
    path("", IntegrationListView.as_view()),
]