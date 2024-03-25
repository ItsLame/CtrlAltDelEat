from django.shortcuts import render
from orders.models import Item, Order
from orders.serializers import ItemSerializer, OrderSerializer
from rest_framework import generics

class AddToCartAPIView(generics.ListCreateAPIView):
    """
    add item to cart one at a time
    view all items in the cart as a list
    """

    queryset = Item.objects.all()
    serializer_class = ItemSerializer

    def perform_create(self, serializer):
        serializer.save()


class GetCartForTableAPIView(generics.ListCreateAPIView):
    serializer_class = ItemSerializer

    def get_queryset(self):
        queryset = Item.objects.all()
        tableNum = self.request.GET.get('tableNumber', None)
        if tableNum is not None:
            queryset = queryset.filter(tableNumber=tableNum)
        return queryset


class OrderCreateAPIView(generics.ListCreateAPIView):
    """
    order cart items
    """

    queryset = Order.objects.all()
    serializer_class = OrderSerializer

    def perform_create(self, serializer):
        serializer.save()
