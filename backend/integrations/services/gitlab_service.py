import requests
from django.conf import settings


def fetch_gitlab_projects(user, username):

    url = f"https://gitlab.com/api/v4/users/{username}/projects"

    headers = {
        "PRIVATE-TOKEN": settings.GITLAB_TOKEN
    }

    response = requests.get(url, headers=headers)

    if response.status_code != 200:
        raise Exception("GitLab API error")

    data = response.json()

    return len(data)