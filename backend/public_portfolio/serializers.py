from rest_framework import serializers
from accounts.models import User
from profiles.models import Profile
from projects.models import Project


class PublicProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = ['title', 'description', 'project_url', 'tech_stack']


class PublicProfileSerializer(serializers.ModelSerializer):
    projects = serializers.SerializerMethodField()
    # github_repos = serializers.SerializerMethodField()

    class Meta:
        model = Profile
        fields = [
            'full_name',
            'bio',
            'profile_image',
            'github',
            'linkedin',
            'portfolio_views', 
            'projects',
            
        ]

    def get_projects(self, obj):
        projects = Project.objects.filter(user=obj.user, is_visible=True)
        return PublicProjectSerializer(projects, many=True).data

    def get_github_repos(self, obj):
        return Project.objects.filter(
            user=obj.user,
            source="github",
            is_visible=True
        ).values("title", "project_url", "tech_stack")