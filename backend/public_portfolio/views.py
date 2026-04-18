from projects.models import Project
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from accounts.models import User
from profiles.models import Profile
from analytics.models import ProfileView
from .serializers import PublicProfileSerializer


class PublicPortfolioView(APIView):
    permission_classes = []  # No authentication required

    def get(self, request, username):
        try:
            user = User.objects.get(username=username)
            profile = Profile.objects.get(user=user)

        except User.DoesNotExist:
            return Response(
                {"error": "User not found"},
                status=status.HTTP_404_NOT_FOUND
            )

        except Profile.DoesNotExist:
            return Response(
                {"error": "Profile not found"},
                status=status.HTTP_404_NOT_FOUND
            )

        ip = request.META.get("HTTP_X_FORWARDED_FOR") or request.META.get("REMOTE_ADDR")

        viewer = request.user if request.user.is_authenticated else None

        # Don't count owner's own views
        if not (viewer and viewer == user):

            if viewer:
                # Logged-in user → track by user
                already_viewed = ProfileView.objects.filter(
                    user=user,
                    viewer=viewer
                ).exists()
            else:
                # Anonymous → track by IP
                already_viewed = ProfileView.objects.filter(
                    user=user,
                    viewer_ip=ip,
                    viewer__isnull=True
                ).exists()

            if not already_viewed:

                profile.portfolio_views += 1
                profile.save(update_fields=["portfolio_views"])

                ProfileView.objects.create(
                    user=user,
                    viewer=viewer,
                    viewer_ip=ip
                )

        serializer = PublicProfileSerializer(profile)
        return Response(serializer.data)