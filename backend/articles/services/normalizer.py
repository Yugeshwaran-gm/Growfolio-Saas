import logging
from datetime import datetime
from email.utils import parsedate_to_datetime


logger = logging.getLogger(__name__)


def _parse_published_at(value):

	if not value:
		return None

	if isinstance(value, datetime):
		return value

	if not isinstance(value, str):
		return None

	text = value.strip()

	if not text:
		return None

	try:
		if text.endswith("Z"):
			return datetime.fromisoformat(text.replace("Z", "+00:00"))
		return datetime.fromisoformat(text)
	except ValueError:
		pass

	try:
		return parsedate_to_datetime(text)
	except (TypeError, ValueError):
		return None


def _normalize_tags(raw_tags):

	if not isinstance(raw_tags, list):
		return []

	tags = []

	for item in raw_tags:
		if isinstance(item, str):
			tag = item.strip()
			if tag:
				tags.append(tag)
			continue

		if isinstance(item, dict):
			tag_name = item.get("name")
			if isinstance(tag_name, str):
				tag = tag_name.strip()
				if tag:
					tags.append(tag)

	return tags


def normalize_devto_article(raw_article):

	try:
		if not isinstance(raw_article, dict):
			return None

		title = raw_article.get("title")
		url = raw_article.get("url")
		external_id = raw_article.get("id")
		published_at = _parse_published_at(raw_article.get("published_at"))

		if not title or not url or external_id in (None, "") or published_at is None:
			return None

		return {
			"title": str(title),
			"description": str(raw_article.get("description") or ""),
			"url": str(url),
			"external_id": str(external_id),
			"published_at": published_at,
			"tags": _normalize_tags(raw_article.get("tag_list")),
			"source": "devto",
		}
	except Exception as exc:
		logger.warning("Failed to normalize Dev.to article: %s", exc)
		return None


def normalize_hashnode_article(raw_article):

	try:
		if not isinstance(raw_article, dict):
			return None

		title = raw_article.get("title")
		url = raw_article.get("url")
		external_id = raw_article.get("id")
		published_at = _parse_published_at(raw_article.get("publishedAt"))

		if not title or not url or external_id in (None, "") or published_at is None:
			return None

		return {
			"title": str(title),
			"description": str(raw_article.get("brief") or ""),
			"url": str(url),
			"external_id": str(external_id),
			"published_at": published_at,
			"tags": _normalize_tags(raw_article.get("tags")),
			"source": "hashnode",
		}
	except Exception as exc:
		logger.warning("Failed to normalize Hashnode article: %s", exc)
		return None


def normalize_medium_article(raw_article):

	try:
		if not isinstance(raw_article, dict):
			return None

		title = raw_article.get("title")
		url = raw_article.get("link")
		external_id = raw_article.get("guid")
		published_at = _parse_published_at(raw_article.get("pubDate"))

		if not title or not url or external_id in (None, "") or published_at is None:
			return None

		return {
			"title": str(title),
			"description": str(raw_article.get("description") or ""),
			"url": str(url),
			"external_id": str(external_id),
			"published_at": published_at,
			"tags": _normalize_tags(raw_article.get("categories")),
			"source": "medium",
		}
	except Exception as exc:
		logger.warning("Failed to normalize Medium article: %s", exc)
		return None
