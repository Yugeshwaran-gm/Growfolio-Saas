# Create your models here.
from django.db import models
from django.conf import settings

class Profile(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    full_name = models.CharField(max_length=150, blank=True)
    bio = models.TextField(blank=True)
    profile_image = models.ImageField(upload_to='profiles/', blank=True, null=True)
    github = models.URLField(blank=True)
    github_username = models.CharField(max_length=150, blank=True)
    linkedin = models.URLField(blank=True)
    resume = models.FileField(upload_to='resumes/', blank=True, null=True)
    portfolio_views = models.PositiveIntegerField(default=0)
    professional_summary = models.TextField(blank=True)
    career_objective = models.TextField(blank=True)
    # Use JSON fields to store lists of education, certificates and extra-curricular activities
    education = models.JSONField(blank=True, null=True)
    certificates = models.JSONField(blank=True, null=True)
    extras = models.JSONField(blank=True, null=True)

    def __str__(self):
        return self.user.email