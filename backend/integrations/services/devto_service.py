import requests
from articles.models import Article


def fetch_devto_articles(user, username):

    url = f"https://dev.to/api/articles?username={username}"

    response = requests.get(url)

    if response.status_code != 200:
        return

    data = response.json()

    for article in data:

        Article.objects.update_or_create(
            url=article["url"],
            defaults={
                "user": user,
                "title": article["title"],
                "description": article.get("description", ""),
                "published_at": article["published_at"],
                "source": "devto"
            }
        )