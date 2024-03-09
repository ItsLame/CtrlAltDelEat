from rest_framework import serializers
from rest_framework.reverse import reverse
from menu.models import Category, MenuItem
from rest_framework.fields import SerializerMethodField
from drf_extra_fields.relations import PresentablePrimaryKeyRelatedField
from taggit.serializers import TagListSerializerField, TaggitSerializer


class MenuItemSerializer(TaggitSerializer, serializers.ModelSerializer):
    url = serializers.HyperlinkedIdentityField(
        view_name='menuitem-detail', lookup_field='uuid', read_only=True
    )
    # category = serializers.SlugRelatedField(slug_field='category_name', queryset=Category.objects.all())
    category = serializers.HyperlinkedRelatedField(
        view_name='category-detail',
        queryset=Category.objects.all(),
        lookup_field='uuid',
    )
    tags = TagListSerializerField()
    ingredients = TagListSerializerField()

    class Meta:
        model = MenuItem
        fields = [
            'menuitem_name',
            'url',
            'cost',
            'description',
            'available',
            'category',
            'ingredients',
            'tags',
            'image',
        ]
        ordering = ('ordering',)
        depth = 1


class CategorySerializer(serializers.ModelSerializer):
    # id = serializers.IntegerField(read_only=True)
    url = serializers.HyperlinkedIdentityField(
        view_name='category-detail', lookup_field='uuid', read_only=True
    )
    ordering = serializers.FloatField(read_only=True)

    class Meta:
        model = Category
        fields = ['category_name', 'url', 'ordering']
        # ordering = ['id']


class MenuSerializer(serializers.ModelSerializer):
    # id = serializers.IntegerField(read_only=True)
    url = serializers.HyperlinkedIdentityField(
        view_name='category-detail', lookup_field='uuid', read_only=True
    )
    menu_items = MenuItemSerializer(
        source='category_items', read_only=True, many=True
    )
    ordering = serializers.FloatField(read_only=True)

    class Meta:
        model = Category
        fields = ['category_name', 'url', 'menu_items', 'ordering']
        # ordering = ['id']
