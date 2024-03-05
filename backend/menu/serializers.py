from rest_framework import serializers
from rest_framework.reverse import reverse
from menu.models import Category, MenuItem
from rest_framework.fields import SerializerMethodField
from drf_extra_fields.relations import PresentablePrimaryKeyRelatedField
from taggit.serializers import (TagListSerializerField, TaggitSerializer)
   

class CategorySerializer(serializers.ModelSerializer):
    # id = serializers.IntegerField(read_only=True)
    url = serializers.HyperlinkedIdentityField(
        view_name='category-detail',
        lookup_field='uuid',
        read_only=True
    )
    ordering = serializers.FloatField(read_only=True)
    class Meta:
        model = Category
        fields = ['name', 'url', 'ordering']
        # ordering = ['id']

class MenuItemSerializer(TaggitSerializer, serializers.ModelSerializer):
    category = serializers.SlugRelatedField(slug_field='name', queryset=Category.objects.all())
    tags = TagListSerializerField()
    ingredients = TagListSerializerField()
    class Meta:
        model = MenuItem
        fields = ['name', 
            'cost', 
            'description', 
            'available', 
            'category', 
            'ingredients', 
            'tags'
            ]
        ordering = ('ordering',)
        depth = 1


