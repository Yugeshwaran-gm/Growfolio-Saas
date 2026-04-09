from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from analytics.models import ArticleView
from .models import Article
from .serializers import ArticleSerializer


# class ArticleListView(APIView):

#     permission_classes = [IsAuthenticated]

#     def get(self, request):

#         articles = Article.objects.filter(user=request.user).order_by("-published_at")

#         serializer = ArticleSerializer(articles, many=True)

#         return Response({
#             "success": True,
#             "data": serializer.data
#         })


class ArticleListCreateView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        articles = Article.objects.filter(user=request.user)

        serializer = ArticleSerializer(articles, many=True)

        return Response({
            "success": True,
            "data": serializer.data
        })


class ArticleDetailView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request, article_id):

        try:
            article = Article.objects.get(
                id=article_id,
                user=request.user
            )
        except Article.DoesNotExist:
            return Response({
                "success": False,
                "error": "Article not found"
            }, status=404)

        ArticleView.objects.create(
            article=article,
            viewer_ip=request.META["REMOTE_ADDR"]
        )

        serializer = ArticleSerializer(article)

        return Response({
            "success": True,
            "data": serializer.data
        })

    def delete(self, request, article_id):

        try:
            article = Article.objects.get(
                id=article_id,
                user=request.user
            )
        except Article.DoesNotExist:
            return Response({
                "success": False,
                "error": "Article not found"
            }, status=404)

        article.delete()

        return Response({
            "success": True,
            "message": "Article deleted"
        })