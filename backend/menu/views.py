from django.shortcuts import render
from menu.models import MenuItem, Category
from menu.serializers import MenuItemSerializer, CategorySerializer
from rest_framework import generics, permissions, authentication
from taggit.serializers import TaggitSerializer
from accounts.permissions import IsKitchenStaffOrReadOnly, IsWaitStaffOrReadOnly, IsManagerOrReadOnly
# Create your views here.

class CategoryListCreateAPIView(generics.ListCreateAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [permissions.IsAdminUser|IsManagerOrReadOnly]
    lookup_field = 'uuid'   

class CategoryDetailAPIView(generics.RetrieveAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [permissions.IsAdminUser|IsManagerOrReadOnly]

    lookup_field = 'uuid'   

class CategoryUpdateAPIView(generics.UpdateAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [permissions.IsAdminUser|IsManagerOrReadOnly]

    lookup_field = 'uuid'

    # CATEGORY ORDER
    def perform_update(self, serializer):
        instance = serializer.save()

class CategoryDestroyAPIView(generics.DestroyAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [permissions.IsAdminUser|IsManagerOrReadOnly]

    lookup_field = 'uuid'

    # CATEGORY ORDER
    def perform_destroy(self, instance):
        super().perform_destroy(instance)       

class MenuItemListCreateAPIView(generics.ListCreateAPIView):
    queryset = MenuItem.objects.all()
    serializer_class = MenuItemSerializer
    permission_classes = [permissions.IsAdminUser|IsManagerOrReadOnly]

    # permission_classes = [permissions.IsAuthenticatedOrReadOnly]


    def perform_create(self, serializer):
        print("Performing create")
        print(serializer)
        serializer.save()




