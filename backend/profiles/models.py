# Create your models here.
from django.db import models
from django.conf import settings

class Profile(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    full_name = models.CharField(max_length=150, blank=True)
    bio = models.TextField(blank=True)
    profile_image = models.ImageField(upload_to='profiles/', blank=True, null=True)
    github = models.URLField(blank=True)
    linkedin = models.URLField(blank=True)
    portfolio_views = models.PositiveIntegerField(default=0)

    def __str__(self):
        return self.user.email