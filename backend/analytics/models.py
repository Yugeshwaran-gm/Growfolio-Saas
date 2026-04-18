from django.db import models
from django.conf import settings

from articles.models import Article
from accounts.models import User


class ProfileView(models.Model):

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="profile_views"
    )
    viewer = models.ForeignKey(
        User,
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="profile_views_made"
    )

    viewer_ip = models.GenericIPAddressField()

    viewed_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["user", "viewer"],
                name="unique_profile_view_per_user"
            )
        ]

    def __str__(self):
        return f"{self.user.email} viewed"
    
class ProjectView(models.Model):

    project = models.ForeignKey(
        "projects.Project",
        on_delete=models.CASCADE,
        related_name="views"
    )
    viewer = models.ForeignKey(
        User,
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="project_views_made"
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
    
    viewer = models.ForeignKey(
        User,
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="article_views_made"
    )

    viewer_ip = models.GenericIPAddressField()
    viewed_at = models.DateTimeField(auto_now_add=True)