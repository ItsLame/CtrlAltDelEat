from rest_framework import serializers
from orders.models import Order

class OrderSerializer(serializers.ModelSerializer):

    class Meta:
        model = Order
        # fields = ['tableNumber', 'itemName', 'cost', 'quantity', 'status', 'alterations', 'timestamp']
        fields = ['tableNumber', 'itemName', 'cost', 'status', 'alterations', 'timestamp']
        ordering = ('timestamp')