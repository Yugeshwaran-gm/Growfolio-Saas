import requests
from django.conf import settings


def fetch_stackexchange_data(user, user_id):

    url = f"https://api.stackexchange.com/2.3/users/{user_id}?site=stackoverflow&key={settings.STACKEXCHANGE_KEY}"

    response = requests.get(url)

    if response.status_code != 200:
        raise Exception("StackExchange API error")

    data = response.json()

    return len(data.get("items", []))