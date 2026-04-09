import requests
from django.utils.dateparse import parse_datetime
from articles.models import Article


def fetch_devto_articles(user, username):

    url = f"https://dev.to/api/articles?username={username}&per_page=100"

    print(f"Fetching Dev.to articles for {username}")

    response = requests.get(url)

    if response.status_code != 200:
        print("Dev.to API failed:", response.status_code)
        return 0

    data = response.json()

    print(f"Dev.to returned {len(data)} articles")

    count = 0

    for article in data:

        published_at = parse_datetime(article["published_at"])

        obj, created = Article.objects.update_or_create(
            url=article["url"],
            defaults={
                "user": user,
                "title": article["title"],
                "description": article.get("description", ""),
                "published_at": published_at,
                "source": "devto",
                "external_id": str(article["id"]),
            }
        )

        if created:
            print("Inserted:", article["title"])
        else:
            print("Updated:", article["title"])

        count += 1

    return count