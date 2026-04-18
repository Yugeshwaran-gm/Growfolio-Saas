from rest_framework import serializers
from .models import RecruiterContact, RecruiterSearchHistory, SavedProfile


class SavedProfileSerializer(serializers.ModelSerializer):

    class Meta:
        model = SavedProfile
        fields = "__all__"
        read_only_fields = ["recruiter", "created_at"]


class RecruiterSearchHistorySerializer(serializers.ModelSerializer):

    class Meta:
        model = RecruiterSearchHistory
        fields = "__all__"
        read_only_fields = ["recruiter", "created_at"]

class RecruiterContactSerializer(serializers.ModelSerializer):

    class Meta:
        model = RecruiterContact
        fields = "__all__"
        read_only_fields = [
            "recruiter",
            "status",
            "created_at",
            "updated_at"
        ]