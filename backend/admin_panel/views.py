from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from django.conf import settings
from django.utils.timezone import now
from datetime import timedelta
from django.shortcuts import get_object_or_404
from django.db.models import Count

from accounts.models import User
from projects.models import Project
from articles.models import Article
from analytics.models import ProfileView, ProjectView, ArticleView
from skills.models import UserSkill
from integrations.models import ConnectedSource
from notifications.models import Notification


class AdminDashboardView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        if not request.user.is_staff:
            return Response(
                {"error": "Admin access only"},
                status=status.HTTP_403_FORBIDDEN
            )

        total_users = User.objects.count()

        last_7_days = now() - timedelta(days=7)

        active_users = User.objects.filter(
            last_login__gte=last_7_days
        ).count()

        total_projects = Project.objects.count()

        total_profile_views = ProfileView.objects.count()

        return Response({
            "total_users": total_users,
            "active_users_last_7_days": active_users,
            "total_projects": total_projects,
            "total_profile_views": total_profile_views
        })
    
class AdminUserListView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        if not request.user.is_staff:
            return Response({"error": "Admin only"}, status=403)

        users_queryset = User.objects.all()

        # Non-superuser admins should not see other admin accounts.
        if not request.user.is_superuser:
            users_queryset = users_queryset.exclude(is_staff=True)

        users = users_queryset.values(
            "id",
            "email",
            "is_active",
            "is_recruiter",
            "is_creator",
            "is_staff",
            "is_superuser",
            "last_login",
            "date_joined",
        ).order_by("-date_joined", "id")

        return Response(users)
    
class ToggleUserStatusView(APIView):

    permission_classes = [IsAuthenticated]

    def patch(self, request, pk):

        if not request.user.is_staff:
            return Response({"error": "Admin only"}, status=403)

        user = get_object_or_404(User, id=pk)

        if user.id == request.user.id:
            return Response({"error": "You cannot change your own account status."}, status=400)

        if user.is_staff and not request.user.is_superuser:
            return Response({"error": "Only superadmins can change another admin account."}, status=403)

        user.is_active = not user.is_active
        user.save()

        return Response({
            "message": "User status updated",
            "is_active": user.is_active
        })


class AdminUserDetailView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request, pk):

        if not request.user.is_staff:
            return Response({"error": "Admin only"}, status=403)

        user = get_object_or_404(User, id=pk)

        if user.is_staff and not request.user.is_superuser and user.id != request.user.id:
            return Response({"error": "Only superadmins can view other admin accounts."}, status=403)

        return Response({
            "id": user.id,
            "email": user.email,
            "is_active": user.is_active,
            "is_recruiter": user.is_recruiter,
            "is_creator": user.is_creator,
            "is_staff": user.is_staff,
            "is_superuser": user.is_superuser,
            "last_login": user.last_login,
            "date_joined": user.date_joined,
        })


class AdminContentView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        if not request.user.is_staff:
            return Response({"error": "Admin access only"}, status=status.HTTP_403_FORBIDDEN)

        latest_articles = list(
            Article.objects.select_related("user")
            .order_by("-published_at", "-created_at", "-id")
            .values("id", "title", "source", "published_at", "user__email")[:5]
        )

        latest_projects = list(
            Project.objects.select_related("user")
            .order_by("-created_at", "-id")
            .values("id", "title", "is_visible", "created_at", "user__email")[:5]
        )

        return Response({
            "totals": {
                "articles": Article.objects.count(),
                "projects": Project.objects.count(),
                "skills": UserSkill.objects.count(),
                "integrations": ConnectedSource.objects.count(),
            },
            "latest_articles": latest_articles,
            "latest_projects": latest_projects,
        })


class AdminAnalyticsView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        if not request.user.is_staff:
            return Response({"error": "Admin access only"}, status=status.HTTP_403_FORBIDDEN)

        last_7_days = now() - timedelta(days=7)

        top_viewed_projects = list(
            Project.objects.select_related("user")
            .annotate(view_count=Count("views"))
            .order_by("-view_count", "id")
            .values("id", "title", "user__email", "view_count")[:5]
        )

        return Response({
            "totals": {
                "users": User.objects.count(),
                "projects": Project.objects.count(),
                "profile_views": ProfileView.objects.count(),
                "project_views": ProjectView.objects.count(),
                "article_views": ArticleView.objects.count(),
            },
            "last_7_days": {
                "new_users": User.objects.filter(date_joined__gte=last_7_days).count(),
                "new_projects": Project.objects.filter(created_at__gte=last_7_days).count(),
                "profile_views": ProfileView.objects.filter(viewed_at__gte=last_7_days).count(),
                "project_views": ProjectView.objects.filter(viewed_at__gte=last_7_days).count(),
                "article_views": ArticleView.objects.filter(viewed_at__gte=last_7_days).count(),
            },
            "top_viewed_projects": top_viewed_projects,
        })


class AdminSettingsView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        if not request.user.is_staff:
            return Response({"error": "Admin access only"}, status=status.HTTP_403_FORBIDDEN)

        return Response({
            "user_summary": {
                "admins": User.objects.filter(is_staff=True).count(),
                "creators": User.objects.filter(is_creator=True).count(),
                "recruiters": User.objects.filter(is_recruiter=True).count(),
                "inactive": User.objects.filter(is_active=False).count(),
            },
            "integration_summary": {
                "total": ConnectedSource.objects.count(),
                "connected": ConnectedSource.objects.filter(sync_status="connected").count(),
                "pending": ConnectedSource.objects.filter(sync_status="pending").count(),
                "failed": ConnectedSource.objects.filter(sync_status="failed").count(),
            },
            "notification_summary": {
                "total": Notification.objects.count(),
                "unread": Notification.objects.filter(is_read=False).count(),
            },
            "system": {
                "debug": bool(settings.DEBUG),
                "timezone": settings.TIME_ZONE,
                "language_code": settings.LANGUAGE_CODE,
                "media_url": settings.MEDIA_URL,
                "allowed_hosts_count": len(settings.ALLOWED_HOSTS),
                "installed_apps_count": len(settings.INSTALLED_APPS),
            },
        })