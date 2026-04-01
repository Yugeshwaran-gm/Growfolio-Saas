from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .services.skill_extractor import extract_user_skills


class SkillExtractionView(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request):

        count = extract_user_skills(request.user)

        return Response({
            "success": True,
            "message": f"{count} skills extracted"
        })