from django.db import models
from django.conf import settings

from articles.models import Article


class ProfileView(models.Model):

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="profile_views"
    )

    viewer_ip = models.GenericIPAddressField()

    viewed_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.email} viewed"
    
class ProjectView(models.Model):

    project = models.ForeignKey(
        "projects.Project",
        on_delete=models.CASCADE,
        related_name="views"
    )

    viewer_ip = models.GenericIPAddressField()

    viewed_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.project.title} viewed"

class ArticleView(models.Model):
    article = models.ForeignKey(
    Article,
    on_delete=models.CASCADE,
    related_name="views"
    )
    viewer_ip = models.GenericIPAddressField()
    viewed_at = models.DateTimeField(auto_now_add=True)