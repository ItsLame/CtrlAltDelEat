import uuid

from django.http import JsonResponse
from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.status import HTTP_200_OK, HTTP_400_BAD_REQUEST

from orders.models import Item
from orders.serializers import ItemSerializer
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


class CustomerOrderCreateView(generics.UpdateAPIView):
    """
    Order cart items.
    """
    permission_classes = [permissions.AllowAny]

    def update(self, request, *args, **kwargs):
        table_num = request.GET.get('tableNumber', None)
        if not table_num:
            return JsonResponse({"error": "Table number not provided"}, status=HTTP_400_BAD_REQUEST)

        items = Item.objects.filter(tableNumber=table_num, status="in-cart")
        print(items.values('id'))
        if not items.exists():
            return JsonResponse({"error": "No items found for the specified table number in-cart"},
                                status=HTTP_400_BAD_REQUEST)

        uuid_val = uuid.uuid4()

        # Update the status of these Items to "received" and give it an order number
        items.update(status="received", orderNo=uuid_val)

        return JsonResponse({"status": "Items updated and order created"}, status=HTTP_200_OK)


class GetOrderAPIView(generics.ListAPIView):
    """
    view newly received orders
    """
    serializer_class = ItemSerializer

    def get_queryset(self):
        queryset = Item.objects.all()
        status = "received"
        queryset = queryset.filter(status=status, orderNo__isnull=False).distinct()
        return queryset


class ChangeItemStatusAPIView(generics.UpdateAPIView):
    """
    change item status to prepared or served
    """
    serializer_class = ItemSerializer

    def update(self, request, *args, **kwargs):
        itemId = self.request.GET.get('itemId', None)
        status = self.request.GET.get('status', None)

        if not itemId:
            return JsonResponse({"error": "Item Id not provided"}, status=HTTP_400_BAD_REQUEST)

        if not status:
            return JsonResponse({"error": "status not provided"}, status=HTTP_400_BAD_REQUEST)

        items = Item.objects.filter(id=itemId)

        items.update(status=status)

        return JsonResponse({"status": "Item status updated"}, status=HTTP_200_OK)


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

class CustomerOrderHistoryView(generics.ListAPIView):
    """
    view order history
    """
    serializer_class = ItemSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        queryset = Item.objects.all()
        table_num = self.request.GET.get('tableNumber', None)

        # if status is in-cart then the item is not part of an order
        # if status is ready-to-pay then the table is no longer held by customer and is not associated with his orders
        queryset = queryset.filter(tableNumber=table_num, status__in=['received', 'prepared', 'served'])
        return queryset
