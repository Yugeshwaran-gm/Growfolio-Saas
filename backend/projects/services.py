"""Deprecated module.

GitHub project ingestion now runs exclusively through integrations sync:
`/api/integrations/github/sync/` using `integrations/services/github_service.py`.
"""


def fetch_github_repos(*args, **kwargs):
    raise RuntimeError(
        "Deprecated: use integrations sync pipeline `/api/integrations/github/sync/`."
    )


def fetch_repo_languages(*args, **kwargs):
    raise RuntimeError(
        "Deprecated: use integrations sync pipeline `/api/integrations/github/sync/`."
    )