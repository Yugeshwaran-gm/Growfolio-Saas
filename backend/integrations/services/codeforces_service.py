import requests


def fetch_codeforces_profile(handle):

    url = f"https://codeforces.com/api/user.info?handles={handle}"

    response = requests.get(url)

    if response.status_code != 200:
        raise Exception("Codeforces API error")

    data = response.json()

    return len(data["result"])