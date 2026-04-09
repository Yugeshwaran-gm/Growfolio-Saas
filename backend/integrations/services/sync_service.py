from articles.services.ingestion_service import ingest_articles_for_user

from .devto_service import fetch_devto_articles
from .github_service import fetch_github_repos
from .gitlab_service import fetch_gitlab_projects
from .stackexchange_service import fetch_stackexchange_data
from .youtube_service import fetch_youtube_stats
from .codeforces_service import fetch_codeforces_profile


def sync_integration(user, integration):

    source = integration.source_name

    if source == "devto":
        # return fetch_devto_articles(user, integration.external_username)
        return ingest_articles_for_user(user)

    if source == "github":
        return fetch_github_repos(user, integration.external_username)

    if source == "gitlab":
        return fetch_gitlab_projects(user, integration.external_username)

    if source == "stackexchange":
        return fetch_stackexchange_data(user, integration.external_username)

    if source == "youtube":
        return fetch_youtube_stats(integration.external_username)

    if source == "codeforces":
        return fetch_codeforces_profile(integration.external_username)

    raise Exception("Unsupported integration")