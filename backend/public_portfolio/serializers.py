from rest_framework import serializers
from accounts.models import User
from profiles.models import Profile
from projects.models import Project


class PublicProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = ['title', 'description', 'project_url']


class PublicProfileSerializer(serializers.ModelSerializer):
    projects = serializers.SerializerMethodField()

    class Meta:
        model = Profile
        fields = [
            'full_name',
            'bio',
            'profile_image',
            'github',
            'linkedin',
            'portfolio_views', 
            'projects'
        ]

    def get_projects(self, obj):
        projects = Project.objects.filter(user=obj.user)
        return PublicProjectSerializer(projects, many=True).data