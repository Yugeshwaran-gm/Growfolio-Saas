from rest_framework import serializers
from .models import Article


class ArticleSerializer(serializers.ModelSerializer):

    class Meta:
        model = Article
        fields = [
            "id",
            "title",
            "url",
            "description",
            "source",
            "tags",
            "published_at",
            "created_at"
        ]
        read_only_fields = ["user"]