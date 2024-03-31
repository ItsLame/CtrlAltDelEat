from menu.models import MenuItem, Category, TagTag, IngredientTag
from menu.serializers import (
    MenuItemSerializer,
    CategorySerializer,
    MenuSerializer,
    TagSerializer,
    IngredientSerializer
    
)
from rest_framework import generics, permissions
from authentication.permissions import IsManagerOrReadOnly

from rest_framework.parsers import MultiPartParser
# Create your views here.


class MenuListAPIView(generics.ListAPIView):
    """ 
    Display a list of categories and their nested menu items.
    
    """
    queryset = Category.objects.all()
    serializer_class = MenuSerializer
    permission_classes = [permissions.IsAdminUser | IsManagerOrReadOnly]
    lookup_field = 'uuid'


class CategoryListCreateAPIView(generics.ListCreateAPIView):
    """ 
    Display a list of categories, or create a category.
    """
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [permissions.IsAdminUser | IsManagerOrReadOnly]
    permission_classes = [permissions.AllowAny]

    lookup_field = 'uuid'


class CategoryDetailAPIView(generics.RetrieveAPIView):
    """
    Retrieve the details for a specific category.
    """
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [permissions.IsAdminUser | IsManagerOrReadOnly]

    lookup_field = 'uuid'


class CategoryUpdateAPIView(generics.UpdateAPIView):
    """
    Update the name of a category
    """
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [permissions.IsAdminUser | IsManagerOrReadOnly]

    lookup_field = 'uuid'


class CategoryDestroyAPIView(generics.DestroyAPIView):
    """ 
    Delete a category
    """
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [permissions.IsAdminUser | IsManagerOrReadOnly]


    lookup_field = 'uuid'


class MenuItemListCreateAPIView(generics.ListCreateAPIView):
    """ 
    List all menu items, or create a menu item.
    """
    queryset = MenuItem.objects.all()
    serializer_class = MenuItemSerializer
    permission_classes = [permissions.IsAdminUser | IsManagerOrReadOnly]
    permission_classes = [permissions.AllowAny]
    parser_classes = [MultiPartParser,]

class TagListAPIView(generics.ListAPIView):
    permission_classes = [permissions.AllowAny]

    queryset = TagTag.objects.all().order_by('name')
    serializer_class = TagSerializer

class IngredientListAPIView(generics.ListAPIView):
    permission_classes = [permissions.AllowAny]

    queryset = IngredientTag.objects.all().order_by('name')
    serializer_class = IngredientSerializer