import uuid
from django.db import models
from django.db.models.fields import CharField, UUIDField, IntegerField, DecimalField, TextField, TimeField, AutoField
import time


class Item(models.Model):
    tableNumber = IntegerField()
    itemName = CharField(max_length = 60)
    cost = DecimalField(max_digits=8, decimal_places=2)
    quantity = IntegerField(default=1)
    status = CharField(max_length=15, default="in-cart")
    alterations = TextField(blank=True)
    timestamp = TimeField(auto_now_add=True)
    orderNo = UUIDField(null=True, editable=True, default=None, blank=True)

    # timestamp = BigIntegerField(db_column='timestamp')
    # @property
    # def timestamp(self):
    #     self.timestamp = round(time.time() * 1000)

    # def get_timestamp(self):
    #     result = round(time.time() * 1000)
    #     return result
    #
    # def save(self, *args, **kwargs):
    #     self.timestamp = self.get_timestamp()
    #     super(Item, self).save(*args, **kwargs)

    def __str__(self):
        return self.itemName



