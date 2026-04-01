from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .services.graph_builder import build_user_graph
from .models import GraphNode, GraphEdge

class GraphBuildView(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request):

        build_user_graph(request.user)

        return Response({
            "success": True,
            "message": "Graph generated"
        })

class GraphView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        nodes = GraphNode.objects.filter(user=request.user)
        edges = GraphEdge.objects.filter(user=request.user)

        node_data = [
            {
                "id": n.id,
                "type": n.node_type,
                "name": n.name
            }
            for n in nodes
        ]

        edge_data = [
            {
                "source": e.source_node.id,
                "target": e.target_node.id,
                "type": e.edge_type
            }
            for e in edges
        ]

        return Response({
            "nodes": node_data,
            "edges": edge_data
        })