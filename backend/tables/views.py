from django.shortcuts import render
from tables.models import Tables
from rest_framework import generics
from rest_framework import generics, status
from rest_framework.response import Response
from .models import Tables
from tables.serializers import (
    TableAssistanceRequestSerializer,
    TableAssistedSerializer,
)
from rest_framework import permissions
from authentication.permissions import IsWaitStaffOrReadOnly


class TableAssistanceRequestedAPIViewList(generics.ListAPIView):
    """
    making an API for GET requests to be sent by waitstaff for viewing which tables need assistance,
    """

    queryset = Tables.objects.all()
    serializer_class = TableAssistanceRequestSerializer
    permission_classes = [permissions.IsAdminUser | IsWaitStaffOrReadOnly]

    def perform_create(self, serializer):
        serializer.save()


class TableAssistanceRequestedView(generics.CreateAPIView):
    """
    making an API for POST requests to be sent by customer for requesting asssitance,
    """

    serializer_class = TableAssistanceRequestSerializer
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        table_number = request.data.get('tableNumber')
        assistance_request = Tables.objects.filter(
            tableNumber=table_number
        ).first()
        data = request.data.copy()
        data['request_assistance'] = True
        if assistance_request:
            serializer = TableAssistanceRequestSerializer(
                assistance_request, data=data
            )
        else:
            serializer = TableAssistanceRequestSerializer(data=data)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response(serializer.data, status.HTTP_201_CREATED)
        else:
            return Response(
                serializer.errors, status=status.HTTP_400_BAD_REQUEST
            )


class TableAssistedAPIView(generics.UpdateAPIView):
    """
    making an API for PUT requests to be sent by wait staff for marking customer assistance requests as complete
    """

    queryset = Tables.objects.all()
    serializer_class = TableAssistedSerializer
    lookup_field = 'tableNumber'

    def put(self, request, *args, **kwargs):
        table_number = kwargs.get('tableNumber')
        self.queryset.filter(tableNumber=table_number).update(
            request_assistance=False
        )

        return Response(request.data, status=status.HTTP_200_OK)
