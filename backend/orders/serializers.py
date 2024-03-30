import json

from rest_framework import serializers
from orders.models import Item, Order

class ItemSerializer(serializers.ModelSerializer):

    class Meta:
        model = Item
        fields = ['id','tableNumber', 'itemName', 'cost', 'status', 'alterations', 'timestamp', 'quantity']
        ordering = ('timestamp')


class OrderSerializer(serializers.ModelSerializer):

    items = ItemSerializer(many=True)
    class Meta:
        model = Order
        fields = ['id', 'items']
        ordering = ('id')
        depth = 1

    def create(self, validated_data):
        item_data = validated_data.pop('items')
        order_instance = Order.objects.create(**validated_data)
        for item in item_data:
            i = Item.objects.create(**item)
            order_instance.items.add(i)
        return order_instance