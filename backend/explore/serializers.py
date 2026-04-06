from rest_framework import serializers
from profiles.models import Profile
from projects.models import Project


class ExploreProfileSerializer(serializers.ModelSerializer):

    username = serializers.CharField(source="user.username")
    # projects_count = serializers.SerializerMethodField()
    projects_count = serializers.IntegerField(read_only=True)
    portfolio_url = serializers.SerializerMethodField()
    class Meta:
        model = Profile
        fields = [
            "username",
            "full_name",
            "bio",
            "profile_image",
            "projects_count",
            "portfolio_views",
            "portfolio_url",
        ]

    # def get_projects_count(self, obj):
    #     return Project.objects.filter(user=obj.user, is_visible=True).count()

    def get_portfolio_url(self, obj):
        return f"/portfolio/{obj.user.username}"