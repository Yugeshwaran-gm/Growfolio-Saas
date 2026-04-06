import requests
from django.conf import settings
from projects.models import Project


def fetch_github_repos(user, username):

    url = f"https://api.github.com/users/{username}/repos"

    response = requests.get(url)

    if response.status_code != 200:
        raise Exception("GitHub API error")

    repos = response.json()

    for repo in repos:

        Project.objects.update_or_create(
            github_repo_id=repo["id"],
            defaults={
                "user": user,
                "title": repo["name"],
                "description": repo.get("description", ""),
                "repo_url": repo["html_url"]
            }
        )

    return len(repos)