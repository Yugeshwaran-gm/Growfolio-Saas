from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.generics import UpdateAPIView
from .services import fetch_github_repos
from profiles.models import Profile
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

        ip = request.META.get("REMOTE_ADDR")

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
        profile = request.user.profile
        github_username = profile.github_username

        if not github_username:
            return Response({"error": "GitHub username not set"})

        repos = fetch_github_repos(github_username)

        created_projects = []

        for repo in repos:
            project, created = Project.objects.get_or_create(
                user=request.user,
                title=repo["title"],
                defaults={
                    "description": repo["description"],
                    "project_url": repo["project_url"],
                     "tech_stack": repo["tech_stack"]
                }
            )
            if not created:
                project.tech_stack = repo["tech_stack"]
                project.save(update_fields=["tech_stack"])
                
            if created:
                created_projects.append(project.title)

        return Response({
            "message": "GitHub projects imported",
            "created_projects": created_projects
        })
    
class ToggleProjectVisibility(UpdateAPIView):

    permission_classes = [IsAuthenticated]
    serializer_class = ProjectSerializer

    def get_queryset(self):
        return Project.objects.filter(user=self.request.user)