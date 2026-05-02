from analytics.models import ProjectView
from rest_framework import serializers
from .models import Project
from .order_utils import normalize_project_order

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
            'sort_order',
            'created_at',
            "view_count"
        ]
        read_only_fields = ['id', 'created_at']
    def get_view_count(self, obj):
        return ProjectView.objects.filter(project=obj).count()   

    def update(self, instance, validated_data):
        instance.title = validated_data.get("title", instance.title)
        instance.description = validated_data.get("description", instance.description)
        instance.project_url = validated_data.get("project_url", instance.project_url)
        instance.tech_stack = validated_data.get("tech_stack", instance.tech_stack)
        instance.is_visible = validated_data.get("is_visible", instance.is_visible)
        instance.sort_order = validated_data.get("sort_order", instance.sort_order)
        instance.save(update_fields=["title", "description", "project_url", "tech_stack", "is_visible", "sort_order"])

        normalize_project_order(instance.user)
        return instance