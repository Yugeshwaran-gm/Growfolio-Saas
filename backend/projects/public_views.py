from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from .models import Project
from analytics.models import ProjectView
from .serializers import ProjectSerializer


class PublicProjectDetailView(APIView):

    permission_classes = []  # public endpoint

    def get(self, request, pk):

        try:
            project = Project.objects.get(pk=pk, is_visible=True)

        except Project.DoesNotExist:
            return Response(
                {"error": "Project not found"},
                status=status.HTTP_404_NOT_FOUND
            )

        # record project view
        ProjectView.objects.create(
            project=project,
            viewer_ip=request.META.get("REMOTE_ADDR")
        )

        serializer = ProjectSerializer(project)
        return Response(serializer.data)