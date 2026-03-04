from rest_framework import serializers
from .models import Project

class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = [
            'id',
            'title',
            'description',
            'project_url',
            'tech_stack',
            'is_visible',
            'created_at'
        ]
        read_only_fields = ['id', 'created_at']