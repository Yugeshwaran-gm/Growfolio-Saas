from rest_framework import serializers
from accounts.models import User
from profiles.models import Profile
from projects.models import Project
from articles.serializers import ArticleSerializer
from articles.models import Article
from skills.serializers import UserSkillSerializer
from skills.models import UserSkill


class PublicProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = ['title', 'description', 'project_url', 'tech_stack']


class PublicProfileSerializer(serializers.ModelSerializer):
    projects = serializers.SerializerMethodField()
    articles = serializers.SerializerMethodField()
    skills = serializers.SerializerMethodField()
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
            'articles',
            'skills',
            # 'contact',
            
        ]

    def get_projects(self, obj):
        projects = Project.objects.filter(user=obj.user, is_visible=True)
        return PublicProjectSerializer(projects, many=True).data

    def get_articles(self, obj):
        articles = Article.objects.filter(user=obj.user).order_by('-published_at')[:20]
        return ArticleSerializer(articles, many=True).data

    def get_skills(self, obj):
        user_skills = UserSkill.objects.filter(
            user=obj.user,
            is_visible=True,
        ).select_related('skill').order_by('sort_order', 'skill__name')
        return UserSkillSerializer(user_skills, many=True).data

    def get_contact(self, obj):
        # Expose minimal contact info using existing models only
        return {
            "email": obj.user.email,
            "github": obj.github,
            "linkedin": obj.linkedin,
        }

    def get_github_repos(self, obj):
        return Project.objects.filter(
            user=obj.user,
            source="github",
            is_visible=True
        ).values("title", "project_url", "tech_stack")