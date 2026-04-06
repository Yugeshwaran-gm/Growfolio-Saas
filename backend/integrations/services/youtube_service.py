import requests
from django.conf import settings


def fetch_youtube_stats(channel_id):

    url = f"https://www.googleapis.com/youtube/v3/channels?part=statistics&id={channel_id}&key={settings.YOUTUBE_API_KEY}"

    response = requests.get(url)

    if response.status_code != 200:
        raise Exception("YouTube API error")

    return len(response.json()["items"])