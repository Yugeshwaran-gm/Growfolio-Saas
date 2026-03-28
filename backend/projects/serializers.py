from analytics.models import ProjectView
from rest_framework import serializers
from .models import Project

class ProjectSerializer(serializers.ModelSerializer):
    view_count = serializers.SerializerMethodField()
    class Meta:
        model = Project
        fields = [
            'id',
            'title',
            'description',
            'project_url',
            'tech_stack',
            'is_visible',
            'created_at',
            "view_count"
        ]
        read_only_fields = ['id', 'created_at']
    def get_view_count(self, obj):
        return ProjectView.objects.filter(project=obj).count()   