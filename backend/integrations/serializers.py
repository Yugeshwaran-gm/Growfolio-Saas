from rest_framework import serializers
from .models import ConnectedSource


class ConnectedSourceSerializer(serializers.ModelSerializer):

    class Meta:
        model = ConnectedSource
        fields = "__all__"
        read_only_fields = ["user", "last_sync", "sync_status"]