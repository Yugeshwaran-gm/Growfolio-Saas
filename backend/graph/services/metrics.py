from collections import Counter, defaultdict
from itertools import combinations

from django.db.models import Count, Q

from graph.models import GraphEdge, GraphNode


MAX_TOP_SKILLS = 20
MAX_PAIRWISE_PROJECTS = 300


def _specialization_level(top_skill_share, top_3_share):
    if top_skill_share >= 0.5 or top_3_share >= 0.8:
        return "high"

    if top_skill_share >= 0.3 or top_3_share >= 0.6:
        return "moderate"

    return "broad"


def build_graph_intelligence_metrics(user, top_n=8):
    top_n = max(1, min(int(top_n or 8), MAX_TOP_SKILLS))

    node_queryset = GraphNode.objects.filter(user=user)
    edge_queryset = GraphEdge.objects.filter(user=user)

    total_nodes = node_queryset.count()
    total_edges = edge_queryset.count()
    total_skills = node_queryset.filter(node_type="skill").count()
    total_projects = node_queryset.filter(node_type="project").count()
    total_articles = node_queryset.filter(node_type="article").count()

    uses_edges = edge_queryset.filter(edge_type="USES")
    written_edges = edge_queryset.filter(edge_type="WRITTEN_ABOUT")

    skill_rows = list(
        node_queryset.filter(node_type="skill")
        .annotate(
            project_uses=Count(
                "incoming_edges",
                filter=Q(
                    incoming_edges__user=user,
                    incoming_edges__edge_type="USES",
                ),
            ),
            article_mentions=Count(
                "incoming_edges",
                filter=Q(
                    incoming_edges__user=user,
                    incoming_edges__edge_type="WRITTEN_ABOUT",
                ),
            ),
        )
        .order_by("name")
    )

    skill_items = []

    for row in skill_rows:
        relationship_count = int(row.project_uses or 0) + int(row.article_mentions or 0)

        skill_items.append(
            {
                "id": row.id,
                "name": row.name,
                "relationship_count": relationship_count,
                "project_uses": int(row.project_uses or 0),
                "article_mentions": int(row.article_mentions or 0),
            }
        )

    skill_items.sort(key=lambda item: (-item["relationship_count"], item["name"].lower()))
    top_skills = skill_items[:top_n]

    total_skill_relationships = sum(item["relationship_count"] for item in skill_items)
    top_skill = top_skills[0] if top_skills else None
    top_3_relationships = sum(item["relationship_count"] for item in top_skills[:3])

    top_skill_share = (
        round(top_skill["relationship_count"] / total_skill_relationships, 4)
        if top_skill and total_skill_relationships
        else 0.0
    )
    top_3_share = (
        round(top_3_relationships / total_skill_relationships, 4)
        if total_skill_relationships
        else 0.0
    )

    projects_with_skills = uses_edges.values("source_node_id").distinct().count()
    skills_per_project_rows = uses_edges.values("source_node_id").annotate(skill_count=Count("id"))
    max_skills_in_project = max((row["skill_count"] for row in skills_per_project_rows), default=0)
    avg_skills_per_project = (
        round(float(uses_edges.count()) / projects_with_skills, 2)
        if projects_with_skills
        else 0.0
    )

    articles_with_topics = written_edges.values("source_node_id").distinct().count()
    topics_per_article_rows = written_edges.values("source_node_id").annotate(topic_count=Count("id"))
    max_topics_in_article = max((row["topic_count"] for row in topics_per_article_rows), default=0)
    avg_topics_per_article = (
        round(float(written_edges.count()) / articles_with_topics, 2)
        if articles_with_topics
        else 0.0
    )

    top_article_topics = list(
        written_edges.values("target_node__name")
        .annotate(mentions=Count("id"))
        .order_by("-mentions", "target_node__name")[:top_n]
    )

    normalized_top_article_topics = [
        {
            "name": item["target_node__name"],
            "mentions": int(item["mentions"]),
        }
        for item in top_article_topics
    ]

    top_skill_project_coverage = 0.0

    if top_skill and projects_with_skills:
        covered_projects = uses_edges.filter(target_node_id=top_skill["id"]).values("source_node_id").distinct().count()
        top_skill_project_coverage = round(covered_projects / projects_with_skills, 4)

    pairwise_skills = []
    pairwise_skipped = False

    if projects_with_skills and projects_with_skills <= MAX_PAIRWISE_PROJECTS:
        project_skill_rows = uses_edges.values("source_node_id", "target_node__name")
        project_to_skills = defaultdict(set)

        for row in project_skill_rows:
            skill_name = str(row.get("target_node__name") or "").strip()
            if skill_name:
                project_to_skills[row["source_node_id"]].add(skill_name)

        pair_counter = Counter()

        for skills in project_to_skills.values():
            ordered = sorted(skills, key=lambda value: value.lower())
            for pair in combinations(ordered, 2):
                pair_counter[pair] += 1

        pairwise_skills = [
            {
                "pair": [left, right],
                "project_count": count,
            }
            for (left, right), count in pair_counter.most_common(top_n)
        ]
    else:
        pairwise_skipped = projects_with_skills > MAX_PAIRWISE_PROJECTS

    top_skills_with_frequency = []

    for item in top_skills:
        usage_frequency = (
            round(item["project_uses"] / projects_with_skills, 4)
            if projects_with_skills
            else 0.0
        )

        top_skills_with_frequency.append(
            {
                "name": item["name"],
                "relationship_count": item["relationship_count"],
                "project_uses": item["project_uses"],
                "article_mentions": item["article_mentions"],
                "usage_frequency": usage_frequency,
            }
        )

    return {
        "summary": {
            "total_nodes": total_nodes,
            "total_edges": total_edges,
            "total_skills": total_skills,
            "total_projects": total_projects,
            "total_articles": total_articles,
            "skill_relationships": int(uses_edges.count() + written_edges.count()),
        },
        "top_skills": top_skills_with_frequency,
        "most_connected_technologies": [
            {
                "name": item["name"],
                "relationship_count": item["relationship_count"],
            }
            for item in top_skills
        ],
        "project_concentration": {
            "projects_with_skills": projects_with_skills,
            "avg_skills_per_project": avg_skills_per_project,
            "max_skills_in_project": int(max_skills_in_project),
        },
        "article_topic_concentration": {
            "articles_with_topics": articles_with_topics,
            "avg_topics_per_article": avg_topics_per_article,
            "max_topics_in_article": int(max_topics_in_article),
            "top_topics": normalized_top_article_topics,
        },
        "specialization_summary": {
            "top_skill": top_skill["name"] if top_skill else None,
            "top_skill_share": top_skill_share,
            "top_3_skill_share": top_3_share,
            "specialization_level": _specialization_level(top_skill_share, top_3_share),
        },
        "skill_ecosystem_clustering": {
            "top_skill_pairs": pairwise_skills,
            "pairwise_computation_skipped": pairwise_skipped,
            "pairwise_project_cap": MAX_PAIRWISE_PROJECTS,
        },
        "cross_project_skill_consistency": {
            "top_skill": top_skill["name"] if top_skill else None,
            "top_skill_project_coverage": top_skill_project_coverage,
            "top_skill_project_coverage_percent": round(top_skill_project_coverage * 100, 2),
        },
    }