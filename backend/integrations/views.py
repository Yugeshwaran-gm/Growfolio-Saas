from django.utils import timezone

from .tasks import sync_integration_task
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
import uuid
from .models import ConnectedSource
from .crypto_utils import encrypt_access_token
from .serializers import ConnectedSourceSerializer
from .services.devto_service import fetch_devto_articles
from .services.sync_service import sync_integration

class ConnectSourceView(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request):

        data = request.data

        token = f"growfolio-verify-{uuid.uuid4().hex[:6]}"

        source, created = ConnectedSource.objects.update_or_create(
            user=request.user,
            source_name=data.get("source_name"),
            defaults={
                "connection_type": data.get("connection_type"),
                "external_username": data.get("external_username"),
                "access_token": data.get("access_token"),
                "verification_token": token,
                "sync_status": "pending"
            }
        )

        return Response({
            "success": True,
            "data": {
                "id": source.id,
                "source_name": source.source_name,
                "connection_type": source.connection_type,
                "external_username": source.external_username,
                "verification_token": source.verification_token,
                "sync_status": source.sync_status
            },
            "message": "Source connected successfully"
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

        try:

            integration = ConnectedSource.objects.get(
                user=request.user,
                source_name=source
            )

        except ConnectedSource.DoesNotExist:

            return Response({
                "success": False,
                "error": "Integration not connected"
            })

        try:

            count = sync_integration(
                request.user,
                integration
            )
            sync_integration_task.delay(
                request.user.id,
                source
                )

            integration.sync_status = "connected"
            integration.last_sync = timezone.now()
            integration.error_message = ""

            integration.save()

            return Response({
                "success": True,
                "message": f"{count} items synced"
            })

        except Exception as e:

            integration.sync_status = "failed"
            integration.error_message = str(e)
            integration.save()

            return Response({
                "success": False,
                "error": str(e)
            })

class IntegrationDeleteView(APIView):

    permission_classes = [IsAuthenticated]

    def delete(self, request, source):

        integration = ConnectedSource.objects.filter(
            user=request.user,
            source_name=source
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