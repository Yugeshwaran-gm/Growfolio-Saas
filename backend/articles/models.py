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

    description = models.TextField(blank=True)

    published_at = models.DateTimeField()

    source = models.CharField(max_length=50)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title