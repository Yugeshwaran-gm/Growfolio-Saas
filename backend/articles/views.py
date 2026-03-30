from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
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

    def post(self, request):

        serializer = ArticleSerializer(data=request.data)

        if serializer.is_valid():

            serializer.save(user=request.user)

            return Response({
                "success": True,
                "data": serializer.data
            }, status=status.HTTP_201_CREATED)

        return Response({
            "success": False,
            "errors": serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)


class ArticleDetailView(APIView):

    permission_classes = [IsAuthenticated]

    def patch(self, request, article_id):

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

        serializer = ArticleSerializer(
            article,
            data=request.data,
            partial=True
        )

        if serializer.is_valid():

            serializer.save()

            return Response({
                "success": True,
                "data": serializer.data
            })

        return Response({
            "success": False,
            "errors": serializer.errors
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