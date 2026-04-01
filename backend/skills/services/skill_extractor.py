from articles.models import Article
from projects.models import Project
from skills.models import Skill, UserSkill

IGNORE_TAGS = {
    "web",
    "api",
    "coding",
    "programming",
    "development"
}

def extract_user_skills(user):

    skills_found = set()

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
    for skill_name in skills_found:

        skill, _ = Skill.objects.get_or_create(name=skill_name)

        UserSkill.objects.update_or_create(
            user=user,
            skill=skill,
            defaults={
                "source": "auto"
            }
        )

    return len(skills_found)