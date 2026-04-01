from projects.models import Project
from articles.models import Article
from skills.models import UserSkill
from graph.models import GraphNode, GraphEdge


def build_user_graph(user):

    GraphNode.objects.filter(user=user).delete()
    GraphEdge.objects.filter(user=user).delete()

    skill_nodes = {}

    # Create skill nodes
    for us in UserSkill.objects.filter(user=user):

        node = GraphNode.objects.create(
            user=user,
            node_type="skill",
            name=us.skill.name
        )

        skill_nodes[us.skill.name] = node

    # Create project nodes
    for project in Project.objects.filter(user=user):

        pnode = GraphNode.objects.create(
            user=user,
            node_type="project",
            name=project.title
        )

        if project.tech_stack:

            for tech in project.tech_stack:

                skill_node = skill_nodes.get(tech.lower())

                if skill_node:

                    GraphEdge.objects.create(
                        user=user,
                        source_node=pnode,
                        target_node=skill_node,
                        edge_type="USES"
                    )

    # Create article nodes
    for article in Article.objects.filter(user=user):

        anode = GraphNode.objects.create(
            user=user,
            node_type="article",
            name=article.title
        )

        for tag in article.tags:

            skill_node = skill_nodes.get(tag.lower())

            if skill_node:

                GraphEdge.objects.create(
                    user=user,
                    source_node=anode,
                    target_node=skill_node,
                    edge_type="WRITTEN_ABOUT"
                )