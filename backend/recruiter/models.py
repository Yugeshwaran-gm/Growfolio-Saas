from django.db import models
from django.conf import settings

User = settings.AUTH_USER_MODEL


class SavedProfile(models.Model):

    recruiter = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="saved_profiles"
    )

    profile_user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="recruiter_saved_by"
    )

    notes = models.TextField(blank=True, null=True)

    tags = models.JSONField(default=list, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("recruiter", "profile_user")

    def __str__(self):
        return f"{self.recruiter} saved {self.profile_user}"

class RecruiterSearchHistory(models.Model):

    recruiter = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="recruiter_search_history"
    )

    query = models.CharField(max_length=255, blank=True, null=True)

    role_filter = models.CharField(max_length=100, blank=True, null=True)

    skills_filter = models.JSONField(blank=True, null=True)

    location_filter = models.CharField(max_length=255, blank=True, null=True)

    ordering = models.CharField(max_length=100, blank=True, null=True)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.recruiter} searched {self.query}"
    

class RecruiterContact(models.Model):

    CONTACT_TYPE_CHOICES = [
        ("email", "Email"),
        ("interview", "Interview"),
    ]

    STATUS_CHOICES = [
        ("pending", "Pending"),
        ("accepted", "Accepted"),
        ("rejected", "Rejected"),
    ]

    recruiter = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="contacts_sent"
    )

    candidate = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="contacts_received"
    )

    contact_type = models.CharField(
        max_length=20,
        choices=CONTACT_TYPE_CHOICES
    )

    message = models.TextField(blank=True, null=True)

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="pending"
    )

    created_at = models.DateTimeField(auto_now_add=True)

    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.recruiter} → {self.candidate} ({self.status})"