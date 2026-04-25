from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.generics import UpdateAPIView
from .models import Project
from .serializers import ProjectSerializer
from analytics.models import ProjectView


# Create + List Projects
class ProjectListCreateView(generics.ListCreateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = ProjectSerializer

    def get_queryset(self):
        return Project.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


# Retrieve, Update, Delete Project
class ProjectDetailView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = ProjectSerializer
    queryset = Project.objects.all()

    def get_queryset(self):
        return Project.objects.filter(user=self.request.user)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.delete()
        return Response(
            {"detail": "Project deleted successfully"},
            status=status.HTTP_200_OK
        )
    
    def retrieve(self, request, *args, **kwargs):

        project = self.get_object()

        ip = request.META.get("HTTP_X_FORWARDED_FOR") or request.META.get("REMOTE_ADDR")

        # record project view only if viewer is not owner
        if request.user != project.user:

            already_viewed = ProjectView.objects.filter(
                project=project,
                viewer_ip=ip
            ).exists()

            if not already_viewed:
                ProjectView.objects.create(
                    project=project,
                    viewer_ip=ip
                )

        serializer = self.get_serializer(project)
        return Response(serializer.data)
    
class ImportGithubProjects(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        return Response(
            {
                "detail": "Deprecated endpoint. Use /api/integrations/github/sync/."
            },
            status=status.HTTP_410_GONE,
        )
    
class ToggleProjectVisibility(UpdateAPIView):

    permission_classes = [IsAuthenticated]
    serializer_class = ProjectSerializer

    def get_queryset(self):
        return Project.objects.filter(user=self.request.user)