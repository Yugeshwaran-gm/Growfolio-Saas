from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from django.shortcuts import get_object_or_404

from .models import RecruiterContact, SavedProfile, RecruiterSearchHistory
from .serializers import RecruiterContactSerializer, RecruiterSearchHistorySerializer, SavedProfileSerializer


class SaveProfileView(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request):

        if not request.user.is_recruiter:
            return Response(
                {"error": "Recruiter access only"},
                status=status.HTTP_403_FORBIDDEN
            )

        profile_user_id = request.data.get("profile_user")

        saved = SavedProfile.objects.create(
            recruiter=request.user,
            profile_user_id=profile_user_id,
            notes=request.data.get("notes", "")
        )

        serializer = SavedProfileSerializer(saved)

        return Response(serializer.data, status=status.HTTP_201_CREATED)


class SavedProfilesListView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        if not request.user.is_recruiter:
            return Response(
                {"error": "Recruiter access only"},
                status=status.HTTP_403_FORBIDDEN
            )

        profiles = SavedProfile.objects.filter(
            recruiter=request.user
        ).order_by("-created_at")

        serializer = SavedProfileSerializer(profiles, many=True)

        return Response(serializer.data)


class DeleteSavedProfileView(APIView):

    permission_classes = [IsAuthenticated]

    def delete(self, request, pk):

        if not request.user.is_recruiter:
            return Response(
                {"error": "Recruiter access only"},
                status=status.HTTP_403_FORBIDDEN
            )

        saved_profile = get_object_or_404(
            SavedProfile,
            id=pk,
            recruiter=request.user
        )

        saved_profile.delete()

        return Response(
            {"message": "Saved profile removed"},
            status=status.HTTP_204_NO_CONTENT
        )


class UpdateSavedProfileNotesView(APIView):

    permission_classes = [IsAuthenticated]

    def patch(self, request, pk):

        if not request.user.is_recruiter:
            return Response(
                {"error": "Recruiter access only"},
                status=status.HTTP_403_FORBIDDEN
            )

        saved_profile = get_object_or_404(
            SavedProfile,
            id=pk,
            recruiter=request.user
        )

        notes = request.data.get("notes")

        if notes is None:
            return Response(
                {"error": "Notes field required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        saved_profile.notes = notes
        saved_profile.save()

        serializer = SavedProfileSerializer(saved_profile)

        return Response(serializer.data)
    
class SaveSearchHistoryView(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request):

        if not request.user.is_recruiter:
            return Response(
                {"error": "Recruiter access only"},
                status=status.HTTP_403_FORBIDDEN
            )

        data = request.data.copy()
        data["recruiter"] = request.user.id

        serializer = RecruiterSearchHistorySerializer(data=data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)

        return Response(serializer.errors, status=400)
    
class RecruiterSearchHistoryListView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        if not request.user.is_recruiter:
            return Response(
                {"error": "Recruiter access only"},
                status=status.HTTP_403_FORBIDDEN
            )

        searches = RecruiterSearchHistory.objects.filter(
            recruiter=request.user
        )

        serializer = RecruiterSearchHistorySerializer(
            searches,
            many=True
        )

        return Response(serializer.data)

class DeleteSearchHistoryView(APIView):

    permission_classes = [IsAuthenticated]

    def delete(self, request, pk):

        if not request.user.is_recruiter:
            return Response(
                {"error": "Recruiter access only"},
                status=status.HTTP_403_FORBIDDEN
            )

        history = get_object_or_404(
            RecruiterSearchHistory,
            id=pk,
            recruiter=request.user
        )

        history.delete()

        return Response(
            {"message": "Search history deleted"},
            status=status.HTTP_204_NO_CONTENT
        )
    
class SendContactRequestView(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request):

        if not request.user.is_recruiter:
            return Response(
                {"error": "Recruiter access only"},
                status=status.HTTP_403_FORBIDDEN
            )

        candidate_id = request.data.get("candidate")
        contact_type = request.data.get("contact_type")

        contact = RecruiterContact.objects.create(
            recruiter=request.user,
            candidate_id=candidate_id,
            contact_type=contact_type,
            message=request.data.get("message", "")
        )

        serializer = RecruiterContactSerializer(contact)

        return Response(serializer.data, status=201)
    
class RecruiterSentContactsView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        if not request.user.is_recruiter:
            return Response(
                {"error": "Recruiter access only"},
                status=403
            )

        contacts = RecruiterContact.objects.filter(
            recruiter=request.user
        ).order_by("-created_at")

        serializer = RecruiterContactSerializer(contacts, many=True)

        return Response(serializer.data)

class CandidateReceivedContactsView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        contacts = RecruiterContact.objects.filter(
            candidate=request.user
        ).order_by("-created_at")

        serializer = RecruiterContactSerializer(contacts, many=True)

        return Response(serializer.data)
    
class UpdateContactStatusView(APIView):

    permission_classes = [IsAuthenticated]

    def patch(self, request, pk):

        contact = get_object_or_404(
            RecruiterContact,
            id=pk,
            candidate=request.user
        )

        new_status = request.data.get("status")

        if new_status not in ["accepted", "rejected"]:
            return Response(
                {"error": "Invalid status"},
                status=400
            )

        contact.status = new_status
        contact.save()

        serializer = RecruiterContactSerializer(contact)

        return Response(serializer.data)