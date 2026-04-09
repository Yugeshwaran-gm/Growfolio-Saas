import logging

import requests
from django.db import IntegrityError
from django.utils.dateparse import parse_datetime

from analytics.models import ArticleView
from articles.models import Article
from integrations.models import ConnectedSource
from .normalizer import normalize_devto_article

logger = logging.getLogger(__name__)


def _fetch_devto_articles(username):

    if not username:
        return []

    url = f"https://dev.to/api/articles?username={username}&per_page=100"

    try:
        response = requests.get(url, timeout=15)
        response.raise_for_status()
    except requests.RequestException as exc:
        logger.warning("Dev.to fetch failed for %s: %s", username, exc)
        return []

    try:
        data = response.json()
    except ValueError:
        logger.warning("Dev.to returned non-JSON response for %s", username)
        return []

    if not isinstance(data, list):
        logger.warning("Dev.to response format changed for %s", username)
        return []

    return data


def ingest_articles_for_user(user):

    created_count = 0

    connected_sources = ConnectedSource.objects.filter(user=user)

    for source in connected_sources:

        if source.source_name != "devto":
            continue

        raw_articles = _fetch_devto_articles(source.external_username)

        prepared_articles = []
        incoming_external_ids = set()

        for item in raw_articles:

            if not isinstance(item, dict):
                continue

            normalized_article = normalize_devto_article(item)

            if not normalized_article:
                continue

            title = normalized_article["title"]
            description = normalized_article["description"]
            url = normalized_article["url"]
            external_id = normalized_article["external_id"]
            published_at_raw = normalized_article["published_at"]
            tag_list = normalized_article["tags"]

            if not title or not url or not external_id or not published_at_raw:
                continue

            published_at = parse_datetime(str(published_at_raw))

            if published_at is None:
                continue

            if isinstance(tag_list, list):
                tags = tag_list
            else:
                tags = []

            external_id_str = str(external_id)
            incoming_external_ids.add(external_id_str)
            prepared_articles.append(
                {
                    "title": title,
                    "description": description,
                    "url": url,
                    "external_id": external_id_str,
                    "published_at": published_at,
                    "tags": tags,
                }
            )

        if not prepared_articles:
            continue

        existing_external_ids = set(
            Article.objects.filter(
                source=source.source_name,
                external_id__in=incoming_external_ids,
            ).values_list("external_id", flat=True)
        )

        for article_data in prepared_articles:

            if article_data["external_id"] in existing_external_ids:
                continue

            try:
                created_article = Article.objects.create(
                    user=user,
                    title=article_data["title"],
                    url=article_data["url"],
                    external_id=article_data["external_id"],
                    description=article_data["description"],
                    published_at=article_data["published_at"],
                    source=source.source_name,
                    tags=article_data["tags"],
                )
                created_count += 1
                existing_external_ids.add(article_data["external_id"])

                try:
                    ArticleView.objects.create(
                        article=created_article,
                        viewer_ip="0.0.0.0",
                    )
                except Exception as exc:
                    logger.warning(
                        "Failed to create ArticleView for article %s: %s",
                        created_article.id,
                        exc,
                    )
            except IntegrityError:
                # Skip records that violate uniqueness constraints.
                continue
            except Exception as exc:
                logger.warning(
                    "Failed to ingest Dev.to article for user %s: %s",
                    user.id,
                    exc,
                )
                continue

    return created_count
