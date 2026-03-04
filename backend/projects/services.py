import requests

GITHUB_API = "https://api.github.com/users/{username}/repos"


def fetch_github_repos(username):
    url = GITHUB_API.format(username=username)

    response = requests.get(url)

    if response.status_code != 200:
        return []

    repos = response.json()

    projects = []

    for repo in repos:
        languages = fetch_repo_languages(username, repo["name"])
        projects.append({
            "title": repo["name"],
            "description": repo["description"] or "",
            "project_url": repo["html_url"],
            "tech_stack": languages
        })

    return projects

def fetch_repo_languages(owner, repo):

    url = f"https://api.github.com/repos/{owner}/{repo}/languages"

    response = requests.get(url)

    if response.status_code != 200:
        return []

    languages = response.json()

    return list(languages.keys())