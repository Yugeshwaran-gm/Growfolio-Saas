from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from .models import Project
from analytics.models import ProjectView
from analytics.utils import get_client_ip
from notifications.services import create_notification
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

        viewer = request.user if request.user.is_authenticated else None
        ip = get_client_ip(request)

        if viewer and viewer == project.user:
            serializer = ProjectSerializer(project)
            return Response(serializer.data)

        if viewer:
            already_viewed = ProjectView.objects.filter(
                project=project,
                viewer=viewer,
            ).exists()
        else:
            already_viewed = ProjectView.objects.filter(
                project=project,
                viewer_ip=ip,
                viewer__isnull=True,
            ).exists()

        if not already_viewed:
            ProjectView.objects.create(
                project=project,
                viewer=viewer,
                viewer_ip=ip,
            )

            create_notification(
                user=project.user,
                title="New project view",
                message=f'Your project "{project.title}" was viewed.',
                notification_type="system",
                metadata={
                    "project_id": project.id,
                    "viewer_id": viewer.id if viewer else None,
                    "viewer_ip": ip,
                },
            )

        serializer = ProjectSerializer(project)
        return Response(serializer.data)