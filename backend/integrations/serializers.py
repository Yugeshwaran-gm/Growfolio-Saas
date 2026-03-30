from rest_framework import serializers
from .models import ConnectedSource


class ConnectedSourceSerializer(serializers.ModelSerializer):

    class Meta:
        model = ConnectedSource
        fields = [
            "id",
            "source_name",
            "connection_type",
            "external_username",
            "sync_status",
            "last_sync",
            "error_message"
        ]
        read_only_fields = ["user", "last_sync", "sync_status"]