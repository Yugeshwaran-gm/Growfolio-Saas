from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.core.cache import cache
from django.db.models import Q
from django.contrib.auth import get_user_model

from .models import GraphNode, GraphEdge
from .tasks import build_user_graph_task
from .services.metrics import build_graph_intelligence_metrics
from config.api_contracts import api_error, api_success


GRAPH_PAGE_SIZE_DEFAULT = 250
GRAPH_PAGE_SIZE_MAX = 500
GRAPH_CACHE_TTL_SECONDS = 60
GRAPH_METRICS_CACHE_TTL_SECONDS = 120


def _cache_version_key(user_id):
    return f"graph:version:{user_id}"


def _next_cache_version(user_id):
    key = _cache_version_key(user_id)
    version = cache.get(key)

    if version is None:
        version = 1
    else:
        version += 1

    cache.set(key, version, None)
    return version


def _current_cache_version(user_id):
    version = cache.get(_cache_version_key(user_id))

    if version is None:
        version = 1
        cache.set(_cache_version_key(user_id), version, None)

    return version


def _graph_cache_key(user_id, version, limit, offset):
    return f"graph:data:{user_id}:{version}:{limit}:{offset}"


def _graph_metrics_cache_key(user_id, version, top_n):
    return f"graph:metrics:{user_id}:{version}:{top_n}"

class GraphBuildView(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request):

        _next_cache_version(request.user.id)
        build_user_graph_task.delay(request.user.id)

        return Response({
            "success": True,
            "status": "queued",
            "message": "Graph rebuild queued"
        })

class GraphView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            requested_limit = int(request.query_params.get("limit", GRAPH_PAGE_SIZE_DEFAULT))
        except (TypeError, ValueError):
            requested_limit = GRAPH_PAGE_SIZE_DEFAULT

        try:
            requested_offset = int(request.query_params.get("offset", 0))
        except (TypeError, ValueError):
            requested_offset = 0

        limit = max(1, min(requested_limit, GRAPH_PAGE_SIZE_MAX))
        offset = max(0, requested_offset)

        version = _current_cache_version(request.user.id)
        cache_key = _graph_cache_key(request.user.id, version, limit, offset)
        cached_response = cache.get(cache_key)

        if cached_response is not None:
            return Response(cached_response)

        nodes_queryset = GraphNode.objects.filter(user=request.user).order_by("id")
        edges_queryset = GraphEdge.objects.filter(user=request.user).order_by("id")

        total_nodes = nodes_queryset.count()
        total_edges = edges_queryset.count()

        nodes_page = list(nodes_queryset[offset:offset + limit])
        node_ids = [node.id for node in nodes_page]

        if node_ids:
            edges_page = edges_queryset.filter(
                Q(source_node_id__in=node_ids) | Q(target_node_id__in=node_ids)
            )
        else:
            edges_page = edges_queryset.none()

        node_data = [
            {
                "id": node.id,
                "type": node.node_type,
                "name": node.name
            }
            for node in nodes_page
        ]

        edge_data = [
            {
                "source": edge.source_node.id,
                "target": edge.target_node.id,
                "type": edge.edge_type
            }
            for edge in edges_page
        ]

        payload = {
            "nodes": node_data,
            "edges": edge_data,
            "pagination": {
                "limit": limit,
                "offset": offset,
                "total_nodes": total_nodes,
                "total_edges": total_edges,
                "returned_nodes": len(node_data),
                "returned_edges": len(edge_data),
                "truncated": total_nodes > offset + len(node_data),
            },
        }

        cache.set(cache_key, payload, GRAPH_CACHE_TTL_SECONDS)

        return Response(payload)


class GraphMetricsView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):
        User = get_user_model()
        requested_user_id = request.query_params.get("user_id")

        target_user = request.user

        if requested_user_id is not None:
            try:
                requested_user_id = int(requested_user_id)
            except (TypeError, ValueError):
                return api_error("Invalid user_id", status_code=400)

            if requested_user_id != request.user.id and not getattr(request.user, "is_recruiter", False):
                return api_error("Recruiter access only for external user metrics", status_code=403)

            try:
                target_user = User.objects.get(id=requested_user_id)
            except User.DoesNotExist:
                return api_error("User not found", status_code=404)

        try:
            top_n = int(request.query_params.get("top_n", 8))
        except (TypeError, ValueError):
            top_n = 8

        top_n = max(1, min(top_n, 20))

        version = _current_cache_version(target_user.id)
        cache_key = _graph_metrics_cache_key(target_user.id, version, top_n)

        cached = cache.get(cache_key)

        if cached is not None:
            return api_success(cached)

        metrics = build_graph_intelligence_metrics(target_user, top_n=top_n)
        cache.set(cache_key, metrics, GRAPH_METRICS_CACHE_TTL_SECONDS)

        return api_success(metrics)