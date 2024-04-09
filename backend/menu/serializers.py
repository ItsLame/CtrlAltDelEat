from rest_framework import serializers
from menu.models import Category, MenuItem, TagTag, IngredientTag
from taggit.serializers import TagListSerializerField, TaggitSerializer

class MenuItemSerializer(TaggitSerializer, serializers.ModelSerializer):
    url = serializers.HyperlinkedIdentityField(
        view_name='menu:menuitem-detail', lookup_field='uuid', read_only=True
    )
    category = serializers.HyperlinkedRelatedField(
        view_name='menu:category-detail',
        queryset=Category.objects.all(),
        lookup_field='uuid',
        many=True,
    )
    tags = TagListSerializerField(required=False)
    ingredients = TagListSerializerField(required=False)
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
            'position'
        ]
        depth = 1
        ordering = ["position"]


class CategorySerializer(serializers.ModelSerializer):
    url = serializers.HyperlinkedIdentityField(
        view_name='menu:category-detail', lookup_field='uuid', read_only=True
    )

    class Meta:
        model = Category
        fields = ['category_name', 'url', 'position']
        ordering = ["position"]


class MenuSerializer(serializers.ModelSerializer):
    url = serializers.HyperlinkedIdentityField(
        view_name='menu:category-detail', lookup_field='uuid', read_only=True
    )
    menu_items = MenuItemSerializer(
        source='menuitem_set', read_only=True, many=True
    )

    class Meta:
        model = Category
        fields = ['category_name', 'url', 'menu_items']

class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = TagTag
        fields = ["name"]

class IngredientSerializer(serializers.ModelSerializer):
    class Meta:
        model = IngredientTag
        fields = ["name"]

class MenuItemPositionSerializer(serializers.Serializer):
    menuitem = serializers.HyperlinkedRelatedField(
        view_name='menu:menuitem-detail', lookup_field='uuid', queryset=MenuItem.objects.all()
    )
    position = serializers.IntegerField(required=True)

class MenuItemPositionListSerializer(serializers.ListSerializer):
    child = MenuItemPositionSerializer()

class CategoryPositionSerializer(serializers.Serializer):
    category = serializers.HyperlinkedRelatedField(
        view_name='menu:category-detail', lookup_field='uuid', queryset=Category.objects.all()
    )
    position = serializers.IntegerField(required=True)

class CategoryPositionListSerializer(serializers.ListSerializer):
    child = CategoryPositionSerializer()
