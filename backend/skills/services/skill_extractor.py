from articles.models import Article
from projects.models import Project
from skills.models import Skill, UserSkill
from django.db.models import Max

IGNORE_TAGS = {
    "web",
    "api",
    "coding",
    "programming",
    "development"
}

SKILL_LOGO_URLS = {
    "python": "https://cdn.simpleicons.org/python/3776AB",
    "javascript": "https://cdn.simpleicons.org/javascript/F7DF1E",
    "js": "https://cdn.simpleicons.org/javascript/F7DF1E",
    "typescript": "https://cdn.simpleicons.org/typescript/3178C6",
    "react": "https://cdn.simpleicons.org/react/61DAFB",
    "django": "https://cdn.simpleicons.org/django/092E20",
    "nodejs": "https://cdn.simpleicons.org/nodedotjs/339933",
    "node.js": "https://cdn.simpleicons.org/nodedotjs/339933",
    "html": "https://cdn.simpleicons.org/html5/E34F26",
    "html5": "https://cdn.simpleicons.org/html5/E34F26",
    "css": "https://cdn.simpleicons.org/css3/1572B6",
    "css3": "https://cdn.simpleicons.org/css3/1572B6",
    "tailwind": "https://cdn.simpleicons.org/tailwindcss/06B6D4",
    "tailwindcss": "https://cdn.simpleicons.org/tailwindcss/06B6D4",
    "postgres": "https://cdn.simpleicons.org/postgresql/336791",
    "postgresql": "https://cdn.simpleicons.org/postgresql/336791",
    "mongodb": "https://cdn.simpleicons.org/mongodb/47A248",
    "mysql": "https://cdn.simpleicons.org/mysql/4479A1",
}


def get_skill_logo_url(skill_name):
    return SKILL_LOGO_URLS.get(skill_name.lower(), "")

def extract_user_skills(user):

    skills_found = set()
    next_sort_order = UserSkill.objects.filter(user=user).aggregate(max_order=Max("sort_order")).get("max_order") or 0

    # Extract from article tags
    articles = Article.objects.filter(user=user)

    for article in articles:

        for tag in article.tags:
            if tag.lower() not in IGNORE_TAGS:
                skills_found.add(tag.lower())

    # Extract from project tech stack
    projects = Project.objects.filter(user=user)

    for project in projects:

        if project.tech_stack:
            for tech in project.tech_stack:
                if tech.lower() not in IGNORE_TAGS:
                    skills_found.add(tech.lower())

    # Store skills
    for skill_name in sorted(skills_found):

        skill, created = Skill.objects.get_or_create(
            name=skill_name,
            defaults={"logo_url": get_skill_logo_url(skill_name)}
        )

        if not created and not skill.logo_url:
            skill.logo_url = get_skill_logo_url(skill_name)
            skill.save(update_fields=["logo_url"])

        next_sort_order += 1

        UserSkill.objects.update_or_create(
            user=user,
            skill=skill,
            defaults={
                "source": "auto",
                "sort_order": next_sort_order,
            }
        )

    return {
        "discovered_count": len(skills_found),
        "total_user_skills": UserSkill.objects.filter(user=user).count(),
    }