from django.conf import settings
from django.db import models


class Skill(models.Model):

    name = models.CharField(max_length=100, unique=True)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


class UserSkill(models.Model):

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="user_skills"
    )

    skill = models.ForeignKey(
        Skill,
        on_delete=models.CASCADE
    )

    source = models.CharField(max_length=50)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ["user", "skill"]