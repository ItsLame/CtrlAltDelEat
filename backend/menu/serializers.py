from rest_framework import serializers
from rest_framework.reverse import reverse
from menu.models import Category, MenuItem, Tag, Ingredient
from rest_framework.fields import SerializerMethodField
from drf_extra_fields.relations import PresentablePrimaryKeyRelatedField
from taggit.serializers import (TagListSerializerField, TaggitSerializer)

class IngredientSerializer(serializers.ModelSerializer):
    url = serializers.HyperlinkedIdentityField(
        view_name='ingredient-detail',
        lookup_field='uuid',
        read_only=True
    )
    class Meta:
        model = Ingredient
        fields = ['name', 'url']

class TagSerializer(serializers.ModelSerializer):
    url = serializers.HyperlinkedIdentityField(
        view_name='tag-detail',
        lookup_field='uuid',
        read_only=True
    )
    class Meta:
        model = Tag
        fields = ['name', 'url']

# class TagSerializerField(serializers.ListField):
#     child = serializers.CharField()

#     def to_representation(self, data):
#         return list(data.values_list('name', flat=True))

# class TagSerializer(serializers.ModelSerializer):
#     tags = TagSerializerField(read_only=True)
#     url = serializers.HyperlinkedIdentityField(
#         view_name='tag-detail',
#         lookup_field='uuid',
#         read_only=True
#     )

#     class Meta:
#         model = TaggableManager
#         fields = ['name', 'url', 'tags']    
#     def create(self, validated_data):
#         tags = validated_data.pop('tags')
#         instance = super(TagSerializer, self).create(validated_data)
#         instance.tags.set(*tags)
#         return instance        

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
    category = PresentablePrimaryKeyRelatedField(
        queryset=Category.objects.all(),
        presentation_serializer=CategorySerializer,
        read_source=None
    )
    tags = TagListSerializerField()
    # category = CategorySerializer(required=False, read_only=True)
    ingredients = IngredientSerializer(many=True, required=False, read_only=True)
    class Meta:
        model = MenuItem
        fields = ['name', 
            'cost', 
            'description', 
            'available', 
            'category', 
            'ingredients', 
            'tags']
        ordering = ('ordering',)
        depth = 1


