import logging
import xml.etree.ElementTree as ET

import requests


logger = logging.getLogger(__name__)


def fetch_devto_articles(username):

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


def fetch_hashnode_articles(username):

	if not username:
		return []

	url = "https://gql.hashnode.com/"

	query = """
	query GetUserArticles($username: String!) {
	  user(username: $username) {
		publication {
		  posts(first: 20) {
			edges {
			  node {
				id
				title
				brief
				slug
				url
				publishedAt
				tags {
				  name
				}
			  }
			}
		  }
		}
	  }
	}
	"""

	payload = {
		"query": query,
		"variables": {"username": username},
	}

	try:
		response = requests.post(url, json=payload, timeout=15)
		response.raise_for_status()
	except requests.RequestException as exc:
		logger.warning("Hashnode fetch failed for %s: %s", username, exc)
		return []

	try:
		data = response.json()
	except ValueError:
		logger.warning("Hashnode returned non-JSON response for %s", username)
		return []

	if not isinstance(data, dict):
		logger.warning("Hashnode response format changed for %s", username)
		return []

	edges = (
		data.get("data", {})
		.get("user", {})
		.get("publication", {})
		.get("posts", {})
		.get("edges", [])
	)

	if not isinstance(edges, list):
		logger.warning("Hashnode posts format changed for %s", username)
		return []

	articles = []

	for edge in edges:
		if not isinstance(edge, dict):
			continue

		node = edge.get("node")

		if isinstance(node, dict):
			articles.append(node)

	return articles


def fetch_medium_articles(username):

	if not username:
		return []

	cleaned_username = username.strip().lstrip("@")
	url = f"https://medium.com/feed/@{cleaned_username}"

	try:
		response = requests.get(url, timeout=15)
		response.raise_for_status()
	except requests.RequestException as exc:
		logger.warning("Medium fetch failed for %s: %s", cleaned_username, exc)
		return []

	try:
		root = ET.fromstring(response.text)
	except ET.ParseError:
		logger.warning("Medium returned invalid RSS for %s", cleaned_username)
		return []

	channel = root.find("channel")

	if channel is None:
		logger.warning("Medium RSS format changed for %s", cleaned_username)
		return []

	items = channel.findall("item")

	if not isinstance(items, list):
		logger.warning("Medium items format changed for %s", cleaned_username)
		return []

	articles = []

	for item in items:
		article = {
			"title": item.findtext("title"),
			"link": item.findtext("link"),
			"description": item.findtext("description"),
			"pubDate": item.findtext("pubDate"),
			"guid": item.findtext("guid"),
			"categories": [category.text for category in item.findall("category") if category.text],
		}
		articles.append(article)

	return articles
