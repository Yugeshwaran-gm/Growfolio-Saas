from django.urls   import path
from .views import  GraphView, GraphBuildView, GraphMetricsView

urlpatterns = [
    path("build/", GraphBuildView.as_view()),
    path("metrics/", GraphMetricsView.as_view()),
    path("", GraphView.as_view()),
]