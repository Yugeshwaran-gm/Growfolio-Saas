from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from projects.models import Project
from skills.models import UserSkill
from articles.models import Article
from accounts.models import User
from graph.tasks import build_user_graph_task


@receiver(post_save, sender=Project)
def rebuild_graph_on_project_save(sender, instance, created, **kwargs):
    """Automatically rebuild user's graph when a project is created or updated"""
    build_user_graph_task.delay(instance.user_id)


@receiver(post_delete, sender=Project)
def rebuild_graph_on_project_delete(sender, instance, **kwargs):
    """Automatically rebuild user's graph when a project is deleted"""
    build_user_graph_task.delay(instance.user_id)


@receiver(post_save, sender=UserSkill)
def rebuild_graph_on_userskill_save(sender, instance, created, **kwargs):
    """Automatically rebuild user's graph when a skill is added"""
    build_user_graph_task.delay(instance.user_id)


@receiver(post_delete, sender=UserSkill)
def rebuild_graph_on_userskill_delete(sender, instance, **kwargs):
    """Automatically rebuild user's graph when a skill is removed"""
    build_user_graph_task.delay(instance.user_id)


@receiver(post_save, sender=Article)
def rebuild_graph_on_article_save(sender, instance, created, **kwargs):
    """Automatically rebuild user's graph when an article is created or updated"""
    build_user_graph_task.delay(instance.user_id)


@receiver(post_delete, sender=Article)
def rebuild_graph_on_article_delete(sender, instance, **kwargs):
    """Automatically rebuild user's graph when an article is deleted"""
    build_user_graph_task.delay(instance.user_id)


@receiver(post_save, sender=User)
def initialize_graph_on_user_create(sender, instance, created, **kwargs):
    """Initialize user's graph when they sign up (empty but ready)"""
    if created:
        # Queue an initial graph build - will be empty but creates the structure
        build_user_graph_task.delay(instance.id)
