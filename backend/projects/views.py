from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework import status
from .models import Project
from .serializers import ProjectSerializer

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

    def get_queryset(self):
        return Project.objects.filter(user=self.request.user)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.delete()
        return Response(
            {"detail": "Project deleted successfully"},
            status=status.HTTP_200_OK
        )