from django.urls import path
from .views import ArticleDetailView, ArticleListCreateView

urlpatterns = [
    path("", ArticleListCreateView.as_view()),
    path("<int:article_id>/", ArticleDetailView.as_view()),
]