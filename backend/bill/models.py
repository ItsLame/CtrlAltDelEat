from django.db import models
from django.db.models.fields import CharField, UUIDField, IntegerField, DecimalField, TextField, TimeField, AutoField


class Bill(models.Model):
    orderNo = UUIDField(null=True, editable=True, default=None, blank=True)
    tableNumber = IntegerField()
    totalPrice = IntegerField()

    def __str__(self):
        return self.itemName
