import requests
from projects.models import Project


def fetch_github_repos(user, username):

    url = f"https://api.github.com/users/{username}/repos"

    response = requests.get(url, timeout=10)

    if response.status_code != 200:
        raise Exception("GitHub API error")

    repos = response.json()

    created = 0
    updated = 0

    for repo in repos:

        title = repo.get("name")
        description = repo.get("description") or ""
        project_url = repo.get("html_url")
        language = repo.get("language")

        project, is_created = Project.objects.update_or_create(
            user=user,
            project_url=project_url,   # ✅ correct unique key
            defaults={
                "title": title,
                "description": description,
                "tech_stack": [language] if language else []
            }
        )

        if is_created:
            created += 1
        else:
            updated += 1

    return {
        "fetched": len(repos),
        "created": created,
        "updated": updated
    }

# return len(repos)