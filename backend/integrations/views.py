from django.utils import timezone

from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
import uuid
from .models import ConnectedSource
from .serializers import ConnectedSourceSerializer
from .services.devto_service import fetch_devto_articles

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
                "verification_token": token
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

            if source == "devto":

                count = fetch_devto_articles(
                    request.user,
                    integration.external_username
                )

            else:
                return Response({
                    "success": False,
                    "error": "Unsupported integration"
                })

            integration.sync_status = "success"
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