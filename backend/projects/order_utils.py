from django.db import transaction

from projects.models import Project


def normalize_project_order(user):
    with transaction.atomic():
        projects = list(
            Project.objects.select_for_update()
            .filter(user=user)
            .order_by("sort_order", "created_at", "id")
        )

        for index, project in enumerate(projects, start=1):
            if project.sort_order != index:
                project.sort_order = index
                project.save(update_fields=["sort_order"])
