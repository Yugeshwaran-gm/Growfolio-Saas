from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .models import Article
from .serializers import ArticleSerializer


class ArticleListView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        articles = Article.objects.filter(user=request.user).order_by("-published_at")

        serializer = ArticleSerializer(articles, many=True)

        return Response({
            "success": True,
            "data": serializer.data
        })