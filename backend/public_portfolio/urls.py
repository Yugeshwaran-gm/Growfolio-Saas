from django.urls import path
from .views import PublicPortfolioView, contributions_view

urlpatterns = [
    path('<str:username>/', PublicPortfolioView.as_view()),
    path('<str:username>/contributions/', contributions_view),
]