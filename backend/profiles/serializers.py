from rest_framework import serializers
from .models import Profile

class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = [
            'id',
            'full_name',
            'bio',
            'profile_image',
            'github',
            'github_username',
            'linkedin',
        ]