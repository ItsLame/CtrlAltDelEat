from rest_framework import serializers
from tables.models import Tables

from rest_framework import serializers
from .models import Tables

class TableAssistanceRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tables
        fields = ['tableNumber', 'request_assistance']

class TableAssistedSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tables
        fields = ['request_assistance']
