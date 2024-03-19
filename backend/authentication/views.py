from django.shortcuts import render
from rest_framework import generics, permissions
from django.contrib.auth.models import User, Group
from authentication.serializers import UserSerializer, GroupSerializer, CustomTokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
# Create your views here.

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer



class GroupListCreateAPIView(generics.ListCreateAPIView):
    queryset = Group.objects.all()
    serializer_class = GroupSerializer
    permission_classes = [permissions.AllowAny]

class GroupDetailAPIView(generics.RetrieveAPIView):
    """
    Retrieve the details for a specific category.
    """
    queryset = Group.objects.all()
    serializer_class = GroupSerializer
    permission_classes = [permissions.AllowAny]


    lookup_field = 'pk'

class UserListCreateAPIView(generics.ListCreateAPIView):
    """ 
    Display a list of categories and their nested menu items.
    
    """
    queryset = User.objects.all()
    serializer_class = UserSerializer
    # permission_classes = [permissions.IsAdminUser | IsManagerOrReadOnly]
    permission_classes = [permissions.AllowAny]
    # lookup_field = 'uuid'