from django.shortcuts import render
from rest_framework import generics, permissions
from django.contrib.auth.models import User, Group
from authentication.serializers import (
    UserSerializer,
    GroupSerializer,
    CustomTokenObtainPairSerializer,
)
from rest_framework_simplejwt.views import TokenObtainPairView
from authentication.permissions import IsManagerOrReadOnly

# Create your views here.


class CustomTokenObtainPairView(TokenObtainPairView):
    """
    Custom token obtain pair
    """

    serializer_class = CustomTokenObtainPairSerializer


class GroupListCreateAPIView(generics.ListCreateAPIView):
    """
    List or create groups
    """

    queryset = Group.objects.all()
    serializer_class = GroupSerializer
    permission_classes = [permissions.IsAdminUser | IsManagerOrReadOnly]


class GroupDetailAPIView(generics.RetrieveAPIView):
    """
    Retrieve the details for group.
    """

    queryset = Group.objects.all()
    serializer_class = GroupSerializer
    permission_classes = [permissions.IsAdminUser | IsManagerOrReadOnly]

    lookup_field = 'pk'


class UserListCreateAPIView(generics.ListCreateAPIView):
    """
    Display a list of users or create users

    """

    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAdminUser | IsManagerOrReadOnly]
