from django.urls   import path
from .views import  GraphView, GraphBuildView

urlpatterns = [
    path("build/", GraphBuildView.as_view()),
    path("", GraphView.as_view()),
]