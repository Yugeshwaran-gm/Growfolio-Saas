from rest_framework import generics, permissions
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .services.skill_extractor import extract_user_skills
from .services.ordering import normalize_visible_skill_order
from .models import Skill, UserSkill
from .serializers import SkillSerializer, UserSkillSerializer
from rest_framework.permissions import AllowAny
from config.api_contracts import api_success


class SkillExtractionView(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request):

        result = extract_user_skills(request.user)
        discovered_count = result.get("discovered_count", 0)
        total_user_skills = result.get("total_user_skills", 0)

        return api_success({
            "message": f"{total_user_skills} skills extracted",
            "summary": f"{discovered_count} newly extracted, {total_user_skills} total",
            "discovered_count": discovered_count,
            "total_user_skills": total_user_skills,
        })


class UserSkillDetailView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = UserSkillSerializer

    def get_queryset(self):
        return UserSkill.objects.filter(user=self.request.user).select_related("skill")


class SkillListView(APIView):

    permission_classes = [AllowAny]

    def get(self, request):
        if request.user and request.user.is_authenticated:
            normalize_visible_skill_order(request.user)
            # Return the authenticated user's extracted skills
            user_skills = UserSkill.objects.filter(user=request.user).select_related('skill').order_by('sort_order', 'skill__name')
            serializer = UserSkillSerializer(user_skills, many=True)
            return api_success(serializer.data)

        skills = Skill.objects.all().order_by("name")
        serializer = SkillSerializer(skills, many=True)
        return api_success(serializer.data)