from rest_framework import serializers
from .models import Skill, UserSkill
from .services.ordering import normalize_visible_skill_order


class SkillSerializer(serializers.ModelSerializer):
    class Meta:
        model = Skill
        fields = ["id", "name", "logo_url"]


# class UserSkillSerializer(serializers.ModelSerializer):
#     skill = SkillSerializer()

#     class Meta:
#         model = UserSkill
#         fields = ["skill", "source"]

class UserSkillSerializer(serializers.ModelSerializer):
    skill = SkillSerializer(read_only=True)
    proficiency = serializers.SerializerMethodField()

    class Meta:
        model = UserSkill
        fields = ["id", "skill", "source", "is_visible", "sort_order", "proficiency"]

    # def get_proficiency(self, obj):
    #     count = obj.usage_count or 1
    #     return min(count * 10, 100)
    def get_proficiency(self, obj):
        user = obj.user
        skill_name = obj.skill.name.lower()

        project_count = 0
        article_count = 0

        # count projects using this skill
        for project in user.projects.all():
            tech_stack = project.tech_stack or []
            if skill_name in [str(t).lower() for t in tech_stack]:
                project_count += 1

        # count articles using this skill
        for article in user.articles.all():
            tags = article.tags or []
            if skill_name in [str(t).lower() for t in tags]:
                article_count += 1

        total = project_count + article_count

        if total == 0:
            return 10  # minimum visibility

        return min(total * 20, 100)

    def update(self, instance, validated_data):
        instance.source = validated_data.get("source", instance.source)
        instance.is_visible = validated_data.get("is_visible", instance.is_visible)
        instance.sort_order = validated_data.get("sort_order", instance.sort_order)
        instance.save(update_fields=["source", "is_visible", "sort_order"])

        normalize_visible_skill_order(instance.user)
        return instance