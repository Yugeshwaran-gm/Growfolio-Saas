from django.urls import path

from .public_views import PublicProjectDetailView
from .views import ProjectListCreateView, ProjectDetailView, ToggleProjectVisibility
from .views import ImportGithubProjects
urlpatterns = [
    path('', ProjectListCreateView.as_view()),
    path('<int:pk>/', ProjectDetailView.as_view()),
    path('import-github/', ImportGithubProjects.as_view()),
    path('toggle/<int:pk>/', ToggleProjectVisibility.as_view()),
    path("public/projects/<int:pk>/", PublicProjectDetailView.as_view()),
]