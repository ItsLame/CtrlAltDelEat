from django.shortcuts import render
from orders.models import Order
from orders.serializers import OrderSerializer
from rest_framework import generics

class OrderCreateAPIView(generics.ListCreateAPIView):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer

    def perform_create(self, serializer):
        serializer.save()
