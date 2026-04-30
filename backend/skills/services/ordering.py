from django.db import transaction

from skills.models import UserSkill


def normalize_visible_skill_order(user):
    with transaction.atomic():
        visible_skills = list(
            UserSkill.objects.select_for_update()
            .filter(user=user, is_visible=True)
            .order_by("sort_order", "id")
        )

        for index, user_skill in enumerate(visible_skills, start=1):
            if user_skill.sort_order != index:
                user_skill.sort_order = index
                user_skill.save(update_fields=["sort_order"])
