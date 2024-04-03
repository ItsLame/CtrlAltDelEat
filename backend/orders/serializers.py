import json

from rest_framework import serializers
from orders.models import Item

class ItemSerializer(serializers.ModelSerializer):

    class Meta:
        model = Item
        fields = ['id','tableNumber', 'itemName', 'cost', 'status', 'alterations', 'timestamp', 'quantity', 'orderNo']
        ordering = 'timestamp'

