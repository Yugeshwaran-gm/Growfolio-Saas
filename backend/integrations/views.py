from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.core.exceptions import ValidationError
from django.utils import timezone
import logging
import uuid
from .models import ConnectedSource
from .serializers import ConnectedSourceSerializer
from .services.sync_service import sync_integration

logger = logging.getLogger(__name__)

ALLOWED_SOURCES = set(ConnectedSource.ALLOWED_SOURCE_NAMES)
ALLOWED_CONNECTION_TYPES = {choice[0] for choice in ConnectedSource.CONNECTION_TYPES}
REQUIRED_EXTERNAL_USERNAME_SOURCES = {"github", "devto", "gitlab"}
DEFAULT_CONNECTION_TYPE_BY_SOURCE = {
    "github": "username",
    "devto": "username",
    "gitlab": "username",
    "youtube": "public_id",
    "stackexchange": "public_id",
    "codeforces": "username",
}


def normalize_source_name(value):
    if not isinstance(value, str):
        return ""
    return value.strip().lower()

class ConnectSourceView(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request):

        data = request.data
        source_name = normalize_source_name(data.get("source_name"))
        external_username = (data.get("external_username") or "").strip()
        requested_connection_type = data.get("connection_type")
        default_connection_type = DEFAULT_CONNECTION_TYPE_BY_SOURCE.get(source_name)

        if source_name not in ALLOWED_SOURCES:
            return Response({
                "success": False,
                "error": "Invalid source_name"
            }, status=status.HTTP_400_BAD_REQUEST)

        connection_type = (requested_connection_type or default_connection_type or "").strip().lower()

        if connection_type not in ALLOWED_CONNECTION_TYPES:
            return Response({
                "success": False,
                "error": "Invalid connection_type"
            }, status=status.HTTP_400_BAD_REQUEST)

        if source_name in REQUIRED_EXTERNAL_USERNAME_SOURCES and not external_username:
            return Response({
                "error": "external_username is required for this integration"
            }, status=status.HTTP_400_BAD_REQUEST)

        token = f"growfolio-verify-{uuid.uuid4().hex[:6]}"

        try:
            source, created = ConnectedSource.objects.update_or_create(
                user=request.user,
                source_name=source_name,
                defaults={
                    "connection_type": connection_type,
                    "external_username": external_username,
                    "access_token": data.get("access_token"),
                    "verification_token": token,
                    "sync_status": "pending"
                }
            )
        except ValidationError:
            return Response({
                "success": False,
                "error": "Invalid source_name"
            }, status=status.HTTP_400_BAD_REQUEST)

        return Response({
            "source": source.source_name,
            "status": "connected"
        }, status=status.HTTP_200_OK)
    
# class SyncDevtoView(APIView):

#     permission_classes = [IsAuthenticated]

#     def post(self, request):

#         source = ConnectedSource.objects.filter(
#             user=request.user,
#             source_name="devto"
#         ).first()

#         if not source:
#             return Response({
#                 "success": False,
#                 "error": "Dev.to not connected"
#             })

#         fetch_devto_articles(
#             request.user,
#             source.external_username
#         )

#         source.sync_status = "connected"
#         source.save()

#         return Response({
#             "success": True,
#             "message": "Articles synced"
#         })
    
class IntegrationListView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        integrations = ConnectedSource.objects.filter(
            user=request.user
        )

        serializer = ConnectedSourceSerializer(
            integrations,
            many=True
        )
        
        return Response({
            "success": True,
            "data": serializer.data
        })
    
class IntegrationSyncView(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request, source):
        source_name = normalize_source_name(source)

        if source_name not in ALLOWED_SOURCES:
            return Response({
                "success": False,
                "error": "Invalid source_name"
            }, status=status.HTTP_400_BAD_REQUEST)

        try:

            integration = ConnectedSource.objects.get(
                user=request.user,
                source_name=source_name
            )

        except ConnectedSource.DoesNotExist:

            return Response({
                "success": False,
                "error": "Integration not connected"
            }, status=status.HTTP_404_NOT_FOUND)

        try:
            integration.sync_status = "pending"
            integration.error_message = ""
            integration.save()

            logger.info(
                "Integration sync requested source=%s username=%s",
                source_name,
                (integration.external_username or "").strip() or "<empty>",
            )

            sync_result = sync_integration(request.user, integration)

            created = 0
            updated = 0

            if isinstance(sync_result, dict):
                created = int(sync_result.get("created", 0) or 0)
                updated = int(sync_result.get("updated", 0) or 0)

            integration.sync_status = "connected"
            integration.last_sync = timezone.now()
            integration.error_message = ""
            integration.save(update_fields=["sync_status", "last_sync", "error_message"])

            return Response({
                "status": "completed",
                "created": created,
                "updated": updated
            }, status=status.HTTP_200_OK)

        except Exception as e:

            integration.sync_status = "failed"
            integration.error_message = str(e)
            integration.save()

            return Response({
                "success": False,
                "error": str(e)
            }, status=status.HTTP_502_BAD_GATEWAY)

class IntegrationDeleteView(APIView):

    permission_classes = [IsAuthenticated]

    def delete(self, request, source):
        source_name = normalize_source_name(source)

        if source_name not in ALLOWED_SOURCES:
            return Response({
                "success": False,
                "error": "Invalid source_name"
            }, status=status.HTTP_400_BAD_REQUEST)

        integration = ConnectedSource.objects.filter(
            user=request.user,
            source_name=source_name
        ).first()

        if not integration:
            return Response({
                "success": False,
                "error": "Integration not found"
            })

        integration.delete()

        return Response({
            "success": True,
            "message": "Integration disconnected"
        })