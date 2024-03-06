from django.shortcuts import render
from menu.models import Ingredient, Tag, MenuItem, Category
from menu.serializers import IngredientSerializer, TagSerializer, MenuItemSerializer, CategorySerializer
from rest_framework import generics, permissions, authentication
from taggit.serializers import TaggitSerializer
# Create your views here.

class CategoryListCreateAPIView(generics.ListCreateAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    # authentication_classes = [authentication.SessionAuthentication]
    # permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    lookup_field = 'uuid'   

class CategoryDetailAPIView(generics.RetrieveAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    lookup_field = 'uuid'   

class CategoryUpdateAPIView(generics.UpdateAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    lookup_field = 'uuid'

    # CATEGORY ORDER
    def perform_update(self, serializer):
        instance = serializer.save()

class CategoryDestroyAPIView(generics.DestroyAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    lookup_field = 'uuid'

    # CATEGORY ORDER
    def perform_destroy(self, instance):
        super().perform_destroy(instance)       

class TagListCreateAPIView(generics.ListCreateAPIView):
    queryset = Tag.objects.all()
    serializer_class = TaggitSerializer
    # permission_classes = [permissions.IsAuthenticatedOrReadOnly]

class TagDetailAPIView(generics.RetrieveAPIView):
    queryset = Tag.objects.all()
    serializer_class = TaggitSerializer
    lookup_field = 'uuid'   

class TagUpdateAPIView(generics.UpdateAPIView):
    queryset = Tag.objects.all()
    serializer_class = TaggitSerializer
    lookup_field = 'uuid'

class TagDestroyAPIView(generics.DestroyAPIView):
    queryset = Tag.objects.all()
    serializer_class = TaggitSerializer
    lookup_field = 'uuid'

    def perform_destroy(self, instance):
        super().perform_destroy(instance)    


class IngredientListCreateAPIView(generics.ListCreateAPIView):
    queryset = Ingredient.objects.all()
    serializer_class = IngredientSerializer
    # permission_classes = [permissions.IsAuthenticatedOrReadOnly]

class IngredientDetailAPIView(generics.RetrieveAPIView):
    queryset = Ingredient.objects.all()
    serializer_class = IngredientSerializer
    lookup_field = 'uuid'   

class IngredientUpdateAPIView(generics.UpdateAPIView):
    queryset = Ingredient.objects.all()
    serializer_class = IngredientSerializer
    lookup_field = 'uuid'

class IngredientDestroyAPIView(generics.DestroyAPIView):
    queryset = Ingredient.objects.all()
    serializer_class = IngredientSerializer
    lookup_field = 'uuid'

class MenuItemListCreateAPIView(generics.ListCreateAPIView):
    queryset = MenuItem.objects.all()
    serializer_class = MenuItemSerializer
    # permission_classes = [permissions.IsAuthenticatedOrReadOnly]


    def perform_create(self, serializer):
        print("Performing create")
        print(serializer)
        serializer.save()




