from celery import shared_task
from django.utils import timezone

from .models import ConnectedSource
from .services.sync_service import sync_integration


@shared_task
def sync_integration_task(user_id, source):

    integration = ConnectedSource.objects.get(
        user_id=user_id,
        source_name=source
    )

    try:

        count = sync_integration(
            integration.user,
            integration
        )

        integration.sync_status = "connected"
        integration.last_sync = timezone.now()
        integration.error_message = ""

        integration.save()

        return count

    except Exception as e:

        integration.sync_status = "failed"
        integration.error_message = str(e)
        integration.save()

        raise