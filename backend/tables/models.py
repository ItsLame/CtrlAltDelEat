import uuid
from django.db import models
from django.db.models.fields import CharField, UUIDField, IntegerField, DecimalField, TextField, TimeField
import time

class Tables(models.Model):
    tableNumber = IntegerField()
    request_assistance = models.BooleanField(default=True)
    uuid = UUIDField(default=uuid.uuid4, editable=False, unique=True)

    

    def __str__(self):
        return self.itemName
