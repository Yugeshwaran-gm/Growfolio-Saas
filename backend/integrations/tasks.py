from celery import shared_task
from django.utils import timezone
import logging

from .models import ConnectedSource
from .services.sync_service import sync_integration
from accounts.models import User

logger = logging.getLogger(__name__)


@shared_task(bind=True, max_retries=2)
def sync_integration_task(self, user_id, source):
    try:
        user = User.objects.get(id=user_id)
    except User.DoesNotExist:
        logger.error("Sync task failed: user_id=%s does not exist", user_id)
        return {"error": "User not found"}

    try:
        integration = ConnectedSource.objects.get(
            user_id=user_id,
            source_name=source
        )
    except ConnectedSource.DoesNotExist:
        logger.error(
            "Sync task failed: integration not found for user_id=%s source=%s",
            user_id,
            source
        )
        return {"error": "Integration not found"}

    try:
        logger.info(
            "Sync task started task_id=%s user_id=%s source=%s",
            self.request.id,
            user_id,
            source
        )

        sync_result = sync_integration(user, integration)

        integration.sync_status = "connected"
        integration.last_sync = timezone.now()
        integration.error_message = ""
        integration.save(update_fields=["sync_status", "last_sync", "error_message"])

        logger.info(
            "Sync task completed task_id=%s user_id=%s source=%s result=%s",
            self.request.id,
            user_id,
            source,
            sync_result
        )

        return sync_result

    except Exception as e:
        logger.exception(
            "Sync task failed task_id=%s user_id=%s source=%s error=%s",
            self.request.id,
            user_id,
            source,
            str(e)
        )

        integration.sync_status = "failed"
        integration.error_message = str(e)
        integration.save(update_fields=["sync_status", "error_message"])

        if self.request.retries < self.max_retries:
            logger.info(
                "Sync task will retry task_id=%s user_id=%s source=%s retry_count=%s",
                self.request.id,
                user_id,
                source,
                self.request.retries + 1
            )
            raise self.retry(exc=e, countdown=30)

        raise