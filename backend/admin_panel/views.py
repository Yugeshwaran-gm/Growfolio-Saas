from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from django.utils.timezone import now
from datetime import timedelta
from django.shortcuts import get_object_or_404

from accounts.models import User
from projects.models import Project
from analytics.models import ProfileView


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

        users = User.objects.all().values(
            "id",
            "email",
            "is_active",
            "is_recruiter",
            "is_creator"
        )

        return Response(users)
    
class ToggleUserStatusView(APIView):

    permission_classes = [IsAuthenticated]

    def patch(self, request, pk):

        if not request.user.is_staff:
            return Response({"error": "Admin only"}, status=403)

        user = get_object_or_404(User, id=pk)

        user.is_active = not user.is_active
        user.save()

        return Response({
            "message": "User status updated",
            "is_active": user.is_active
        })