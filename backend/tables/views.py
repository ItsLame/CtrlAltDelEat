from django.shortcuts import render
from tables.models import Tables
from rest_framework import generics
from rest_framework import generics, status
from rest_framework.response import Response
from .models import Tables
from tables.serializers import TableAssistanceRequestSerializer, TableAssistedSerializer
from rest_framework import permissions


class TableAssistanceRequestedAPIView(generics.ListCreateAPIView):
    """ 
    making an API for POST requests to be sent by customer for requesting asssitance, 
    and GET requests being sent by wait staff for retrieving customer assistance requests 
    """
    queryset = Tables.objects.all()
    serializer_class = TableAssistanceRequestSerializer
    permission_classes = [permissions.AllowAny]
    authentication_classes = []

    def perform_create(self, serializer):
        serializer.save()
    
class TableAssistedAPIView(generics.UpdateAPIView):
    """ 
    making an API for PUT requests to be sent by wait staff for marking customer assistance requests as complete
    """
    queryset = Tables.objects.all()
    serializer_class = TableAssistedSerializer
    lookup_field = 'tableNumber'
    
    def update(self, request, *args, **kwargs):
        queryset = self.get_object()
        serializer = TableAssistedSerializer(queryset, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    