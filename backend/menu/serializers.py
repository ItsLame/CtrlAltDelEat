from rest_framework import serializers
from menu.models import Category, MenuItem
from taggit.serializers import TagListSerializerField, TaggitSerializer


class MenuItemSerializer(TaggitSerializer, serializers.ModelSerializer):
    url = serializers.HyperlinkedIdentityField(
        view_name='menuitem-detail', lookup_field='uuid', read_only=True
    )
    category = serializers.HyperlinkedRelatedField(
        view_name='category-detail',
        queryset=Category.objects.all(),
        lookup_field='uuid',
        many=True,
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
        depth = 1


class CategorySerializer(serializers.ModelSerializer):
    url = serializers.HyperlinkedIdentityField(
        view_name='category-detail', lookup_field='uuid', read_only=True
    )

    class Meta:
        model = Category
        fields = ['category_name', 'url']


class MenuSerializer(serializers.ModelSerializer):
    url = serializers.HyperlinkedIdentityField(
        view_name='category-detail', lookup_field='uuid', read_only=True
    )
    menu_items = MenuItemSerializer(
        source='menuitem_set', read_only=True, many=True
    )

    class Meta:
        model = Category
        fields = ['category_name', 'url', 'menu_items']
