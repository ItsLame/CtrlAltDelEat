import uuid
from django.db import models
from django.db.models.fields import CharField, UUIDField, IntegerField, DecimalField, TextField, TimeField
import time

class Order(models.Model):
    tableNumber = IntegerField()
    itemName = CharField(max_length = 60)
    cost = DecimalField(max_digits=8, decimal_places=2)
    quantity = IntegerField()
    status = CharField(max_length=15)
    alterations = TextField()
    #timestamp = BigIntegerField(db_column='timestamp')
    timestamp = TimeField(auto_now_add=True)
    uuid = UUIDField(default=uuid.uuid4, editable=False, unique=True)

    # @property
    # def timestamp(self):
    #     self.timestamp = round(time.time() * 1000)

    # def get_timestamp(self):
    #     result = round(time.time() * 1000)
    #     return result
    #
    # def save(self, *args, **kwargs):
    #     self.timestamp = self.get_timestamp()
    #     super(Order, self).save(*args, **kwargs)

    def __str__(self):
        return self.itemName
