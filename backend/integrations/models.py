from django.conf import settings
from django.db import models


class ConnectedSource(models.Model):

    CONNECTION_TYPES = [
        ("oauth", "OAuth"),
        ("username", "Username"),
        ("token", "Token"),
        ("public_id", "Public ID"),
    ]

    SOURCE_NAMES = [
        ("github", "GitHub"),
        ("gitlab", "GitLab"),
        ("devto", "Dev.to"),
        ("hashnode", "Hashnode"),
        ("stackexchange", "StackExchange"),
        ("codeforces", "Codeforces"),
        ("orcid", "ORCID"),
        ("youtube", "YouTube"),
    ]

    SYNC_STATUS = [
        ("connected", "Connected"),
        ("failed", "Failed"),
        ("pending", "Pending"),
    ]

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="connected_sources"
    )

    source_name = models.CharField(max_length=50, choices=SOURCE_NAMES)

    connection_type = models.CharField(
        max_length=20,
        choices=CONNECTION_TYPES
    )

    external_username = models.CharField(
        max_length=255,
        blank=True,
        null=True
    )

    access_token = models.TextField(blank=True, null=True)
    
    verification_token = models.CharField(max_length=100, blank=True, null=True)

    is_verified = models.BooleanField(default=False)
    
    last_sync = models.DateTimeField(blank=True, null=True)

    sync_status = models.CharField(
        max_length=20,
        choices=SYNC_STATUS,
        default="pending"
    )

    error_message = models.TextField(blank=True, null=True)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.email} - {self.source_name}"