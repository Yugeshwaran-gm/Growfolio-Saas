from django.db.models import Q, Count
from rest_framework.generics import ListAPIView
from profiles.models import Profile
from projects.models import Project
from .serializers import ExploreProfileSerializer


class ExploreProfilesView(ListAPIView):

    serializer_class = ExploreProfileSerializer

    def get_queryset(self):

        queryset = Profile.objects.select_related("user").annotate(
            projects_count=Count("user__projects",
            filter=Q(user__projects__is_visible=True))
        )

        # SEARCH
        search_query = self.request.query_params.get("q")

        if search_query:
            queryset = queryset.filter(
                Q(full_name__icontains=search_query) |
                Q(bio__icontains=search_query) |
                Q(user__username__icontains=search_query)
            )

        # FILTER BY ROLE
        role = self.request.query_params.get("role")

        if role == "creator":
            queryset = queryset.filter(user__is_creator=True)

        elif role == "recruiter":
            queryset = queryset.filter(user__is_recruiter=True)

        # ORDERING
        ordering = self.request.query_params.get("ordering")

        if ordering == "views":
            queryset = queryset.order_by("-portfolio_views")

        return queryset