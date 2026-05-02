from rest_framework import serializers
from .models import Profile

class ProfileSerializer(serializers.ModelSerializer):
    is_staff = serializers.SerializerMethodField()
    is_superuser = serializers.SerializerMethodField()
    email = serializers.SerializerMethodField()
    
    class Meta:
        model = Profile
        fields = [
            'id',
            'email',
            'full_name',
            'bio',
            'profile_image',
            'github',
            'github_username',
            'linkedin',
            'is_staff',
            'is_superuser',
        ]

    def get_is_staff(self, obj):
        return obj.user.is_staff

    def get_is_superuser(self, obj):
        return obj.user.is_superuser

    def get_email(self, obj):
        return obj.user.email