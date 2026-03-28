from django.urls import path
from .views import ConnectSourceView, SyncDevtoView

urlpatterns = [
    path("connect/", ConnectSourceView.as_view()),
    path("devto/sync/", SyncDevtoView.as_view()),
]