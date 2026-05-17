import logging

from celery import shared_task
from django.contrib.auth import get_user_model

from .services.graph_builder import build_user_graph

logger = logging.getLogger(__name__)


@shared_task(bind=True)
def build_user_graph_task(self, user_id):
    User = get_user_model()

    try:
        user = User.objects.get(id=user_id)
    except User.DoesNotExist:
        logger.error("Graph rebuild skipped: user_id=%s not found", user_id)
        return {"status": "failed", "error": "User not found"}

    logger.info("Graph rebuild started task_id=%s user_id=%s", self.request.id, user_id)
    build_user_graph(user)
    logger.info("Graph rebuild completed task_id=%s user_id=%s", self.request.id, user_id)

    return {"status": "completed"}