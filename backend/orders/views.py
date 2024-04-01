from django.shortcuts import render
from orders.models import Item, Order
from orders.serializers import ItemSerializer, OrderSerializer
from rest_framework import generics
from rest_framework import permissions

class AddToCartAPIView(generics.ListCreateAPIView):
    """
    add item to cart one at a time
    view all items in the cart as a list
    """

    queryset = Item.objects.all()
    serializer_class = ItemSerializer
    permission_classes = [permissions.AllowAny]

    def perform_create(self, serializer):
        serializer.save()

class RemoveFromCartAPIView(generics.DestroyAPIView):
    """
    remove item from cart
    """
    queryset = Item.objects.all()
    serializer_class = ItemSerializer
    permission_classes = [permissions.AllowAny]

class GetCartForTableAPIView(generics.ListCreateAPIView):
    """
        view items in the cart for a particular table
    """

    serializer_class = ItemSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        queryset = Item.objects.all()
        tableNum = self.request.GET.get('tableNumber', None)
        status = "in-cart"
        if tableNum is not None:
            queryset = queryset.filter(tableNumber=tableNum, status=status)
        return queryset


class OrderCreateAPIView(generics.ListCreateAPIView):
    """
    order cart items
    """

    queryset = Order.objects.all()
    serializer_class = OrderSerializer

    def perform_create(self, serializer):
        serializer.save()


class GetOrderAPIView(generics.ListAPIView):
    """
    view newly received orders
    """
    serializer_class = OrderSerializer
    def get_queryset(self):
        queryset = Order.objects.all()
        status = "received"
        queryset = queryset.filter(items__status=status).distinct()
        return queryset

class ChangeItemStatusAPIView(generics.UpdateAPIView):
    """
    change item status
    """
    queryset = Item.objects.all()
    serializer_class = ItemSerializer

class GetPreparedItemsAPIView(generics.ListAPIView):
    """
    view items prepared by kitchen staff
    """
    serializer_class = ItemSerializer

    def get_queryset(self):
        queryset = Item.objects.all()
        status = "prepared"
        queryset = queryset.filter(status=status)
        return queryset