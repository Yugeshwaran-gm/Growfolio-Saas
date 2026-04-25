import requests
import logging
from projects.models import Project

logger = logging.getLogger(__name__)


def _raise_github_http_error(response):
    if response.status_code == 404:
        raise Exception("Invalid GitHub username")

    if response.status_code == 403:
        remaining = response.headers.get("X-RateLimit-Remaining")
        if remaining == "0":
            raise Exception("GitHub API rate limit exceeded")

        try:
            payload = response.json()
            message = str(payload.get("message", "")).lower()
            if "rate limit" in message:
                raise Exception("GitHub API rate limit exceeded")
        except ValueError:
            pass

    raise Exception("GitHub service unavailable")


def fetch_github_repos(user, username):

    normalized_username = (username or "").strip()
    logger.info("GitHub sync started for username=%s", normalized_username or "<empty>")

    url = f"https://api.github.com/users/{username}/repos"

    try:
        response = requests.get(url, timeout=5)
    except requests.RequestException as exc:
        logger.exception("GitHub request failed for username=%s", normalized_username or "<empty>")
        raise Exception("GitHub service unavailable") from exc

    logger.info(
        "GitHub API response for username=%s status_code=%s body=%s",
        normalized_username or "<empty>",
        response.status_code,
        (response.text or "")[:2000],
    )

    if response.status_code != 200:
        _raise_github_http_error(response)

    try:
        repos = response.json()
    except ValueError as exc:
        raise Exception("GitHub service unavailable") from exc

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