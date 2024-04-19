from menu.models import MenuItem, Category, MenuItemImage
from menu.serializers import (
    MenuItemSerializer,
    CategorySerializer,
    MenuSerializer,
    MenuItemImageSerializer,
    MenuItemPositionListSerializer,
    CategoryPositionListSerializer,
)
from rest_framework import generics, permissions, views, status
from authentication.permissions import IsManagerOrReadOnly
from rest_framework.response import Response


# Create your views here.


class MenuListAPIView(generics.ListAPIView):
    """
    Display a list of categories and their nested menu items.

    """

    queryset = Category.objects.all()
    serializer_class = MenuSerializer
    permission_classes = [permissions.IsAdminUser | IsManagerOrReadOnly]
    lookup_field = 'uuid'


class MenuItemImageListCreateAPIView(generics.ListCreateAPIView):
    """
    List and create menu item images
    """

    queryset = MenuItemImage.objects.all()
    serializer_class = MenuItemImageSerializer
    permission_classes = [permissions.IsAdminUser | IsManagerOrReadOnly]


class CategoryListCreateAPIView(generics.ListCreateAPIView):
    """
    Display a list of categories, or create a category.
    """

    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [permissions.IsAdminUser | IsManagerOrReadOnly]

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
    lookup_field = 'uuid'


class MenuItemDetailAPIView(generics.RetrieveAPIView):
    """
    Retrieve menu item
    """

    queryset = MenuItem.objects.all()
    serializer_class = MenuItemSerializer
    permission_classes = [permissions.IsAdminUser | IsManagerOrReadOnly]
    lookup_field = 'uuid'


class MenuItemUpdateAPIView(generics.UpdateAPIView):
    """
    Update menu item
    """

    queryset = MenuItem.objects.all()
    serializer_class = MenuItemSerializer
    permission_classes = [permissions.IsAdminUser | IsManagerOrReadOnly]
    lookup_field = 'uuid'


class MenuItemDestroyAPIView(generics.DestroyAPIView):
    """
    Destroy menu item
    """

    queryset = MenuItem.objects.all()
    serializer_class = MenuItemSerializer
    permission_classes = [permissions.IsAdminUser | IsManagerOrReadOnly]
    lookup_field = 'uuid'


class UpdateMenuItemPositionAPIView(views.APIView):
    """
    Update position of menu items
    """

    permission_classes = [permissions.IsAdminUser | IsManagerOrReadOnly]

    def post(self, request, *args, **kwargs):
        serializer = MenuItemPositionListSerializer(data=request.data)
        if serializer.is_valid():
            for item in serializer.validated_data:
                menuitem = item.get('menuitem')
                menuitem.position = item.get('position')
                menuitem.save()
            return Response(
                {'message': 'Updated positions'},
                status=status.HTTP_201_CREATED,
            )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UpdateCategoryPositionAPIView(views.APIView):
    """
    Update position of categories
    """

    permission_classes = [permissions.IsAdminUser | IsManagerOrReadOnly]

    def post(self, request, *args, **kwargs):
        serializer = CategoryPositionListSerializer(data=request.data)
        if serializer.is_valid():
            for item in serializer.validated_data:
                category = item.get('category')
                category.position = item.get('position')
                category.save()
            return Response(
                {'message': 'Updated positions'},
                status=status.HTTP_201_CREATED,
            )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
