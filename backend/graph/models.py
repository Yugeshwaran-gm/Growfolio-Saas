from django.conf import settings
from django.db import models


class GraphNode(models.Model):

    NODE_TYPES = [
        ("skill", "Skill"),
        ("project", "Project"),
        ("article", "Article"),
        ("topic", "Topic"),
    ]

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE
    )

    node_type = models.CharField(max_length=50, choices=NODE_TYPES)

    name = models.CharField(max_length=255)

    metadata = models.JSONField(blank=True, null=True)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.node_type}: {self.name}"


class GraphEdge(models.Model):

    EDGE_TYPES = [
        ("USES", "Uses"),
        ("WRITTEN_ABOUT", "Written About"),
        ("BUILT_WITH", "Built With"),
        ("RELATED_TO", "Related To"),
    ]

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE
    )

    source_node = models.ForeignKey(
        GraphNode,
        related_name="outgoing_edges",
        on_delete=models.CASCADE
    )

    target_node = models.ForeignKey(
        GraphNode,
        related_name="incoming_edges",
        on_delete=models.CASCADE
    )

    edge_type = models.CharField(max_length=50, choices=EDGE_TYPES)

    created_at = models.DateTimeField(auto_now_add=True)