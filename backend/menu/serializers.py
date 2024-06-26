from rest_framework import serializers
from menu.models import Category, MenuItem, MenuItemImage
from taggit.serializers import TagListSerializerField, TaggitSerializer


class MenuItemSerializer(TaggitSerializer, serializers.ModelSerializer):
    """
    Serializes menu items
    """

    # Hyperlink to access individual menu item detail
    url = serializers.HyperlinkedIdentityField(
        view_name='menu:menuitem-detail', lookup_field='uuid', read_only=True
    )

    # Hyperlinked related field for categories
    category = serializers.HyperlinkedRelatedField(
        view_name='menu:category-detail',
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
            'position',
        ]
        depth = 1
        ordering = ['position']


class MenuItemImageSerializer(serializers.ModelSerializer):
    """
    Serializes menu item images
    """

    class Meta:
        model = MenuItemImage
        fields = ('image',)


class CategorySerializer(serializers.ModelSerializer):
    """
    Serializes categories
    """

    # Hyperlink to access individual category detail
    url = serializers.HyperlinkedIdentityField(
        view_name='menu:category-detail', lookup_field='uuid', read_only=True
    )

    class Meta:
        model = Category
        fields = ['category_name', 'url', 'position']
        ordering = ['position']


class MenuSerializer(serializers.ModelSerializer):
    """
    Serializer for the menu list broken down by category with nested items
    """

    url = serializers.HyperlinkedIdentityField(
        view_name='menu:category-detail', lookup_field='uuid', read_only=True
    )
    menu_items = MenuItemSerializer(
        source='menuitem_set', read_only=True, many=True
    )

    class Meta:
        model = Category
        fields = ['category_name', 'url', 'menu_items']


class MenuItemPositionSerializer(serializers.Serializer):
    """
    Serializer that takes in menuitem:positions
    """

    menuitem = serializers.HyperlinkedRelatedField(
        view_name='menu:menuitem-detail',
        lookup_field='uuid',
        queryset=MenuItem.objects.all(),
    )
    position = serializers.IntegerField(required=True)


class MenuItemPositionListSerializer(serializers.ListSerializer):
    """
    Serializer for lists of menuitem_positions
    """

    child = MenuItemPositionSerializer()


class CategoryPositionSerializer(serializers.Serializer):
    """
    Serializer for Category:Positions
    """

    category = serializers.HyperlinkedRelatedField(
        view_name='menu:category-detail',
        lookup_field='uuid',
        queryset=Category.objects.all(),
    )
    position = serializers.IntegerField(required=True)


class CategoryPositionListSerializer(serializers.ListSerializer):
    """
    Serializer for Category:position lists
    """

    child = CategoryPositionSerializer()
