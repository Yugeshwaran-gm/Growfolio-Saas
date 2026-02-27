from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from accounts.models import User
from profiles.models import Profile
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
        profile.portfolio_views += 1
        profile.save(update_fields=["portfolio_views"])
        
        serializer = PublicProfileSerializer(profile)
        return Response(serializer.data)