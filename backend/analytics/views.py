from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .models import ProfileView, ProjectView


class DashboardAnalyticsView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        user = request.user

        profile_views = ProfileView.objects.filter(user=user).count()

        # Count all project view records for projects owned by the logged-in user.
        total_project_views = ProjectView.objects.filter(project__user=user).count()

        return Response({
            "profile_views": profile_views,
            "project_views": total_project_views
        })