from django.conf import settings
from django.db import models


class Article(models.Model):

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="articles"
    )

    title = models.CharField(max_length=500)

    url = models.URLField()

    external_id = models.CharField(
    max_length=100,
    unique=True,
    null=True,
    blank=True
    )
    
    description = models.TextField(blank=True)

    published_at = models.DateTimeField()

    source = models.CharField(max_length=50)

    tags = models.JSONField(default=list, blank=True)
    
    source = models.CharField(max_length=50)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title
    
    class Meta:
        unique_together = ["source", "external_id"]