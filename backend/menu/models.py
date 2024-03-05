import uuid
from django.db import models
from django.db.models import Max
from django.db.models.fields import CharField, DecimalField, BooleanField, TextField, UUIDField, FloatField
from taggit.managers import TaggableManager
from taggit.models import TaggedItemBase, ItemBase
from rest_framework import permissions
# Create your models here.

class Category(models.Model):
    name = CharField(max_length = 60, unique=True)
    uuid = UUIDField(default=uuid.uuid4, editable=False, unique=True)

    def num_items():
        try:
            new_max = Category.objects.aggregate(Max('ordering'))['ordering__max'] + 1
        except TypeError:
            new_max = 0
        print(new_max)
        return new_max
    ordering = FloatField(default=num_items)


    def __str__(self):
        return self.name



class ThroughIngredientTag(TaggedItemBase):
    content_object = models.ForeignKey('MenuItem', on_delete=models.CASCADE)

class ThroughTagTag(TaggedItemBase):
    content_object = models.ForeignKey('MenuItem', on_delete=models.CASCADE)    

class MenuItem(models.Model):
    def num_items():
        num_categories = Category.objects.order_by("-id")[0].id
        print(num_categories)
        return num_categories
    name = CharField(max_length = 60)
    cost = DecimalField(max_digits = 8, decimal_places=2)
    description = CharField(max_length = 255)
    available = BooleanField()
    ordering = FloatField(default=num_items)
    category = models.ForeignKey(Category, on_delete=models.PROTECT)
    ingredients = TaggableManager(blank=False, through=ThroughIngredientTag, related_name='ingredient_tags')
    tags = TaggableManager(blank=False, through=ThroughTagTag, related_name='tag_tags')
    uuid = UUIDField(default=uuid.uuid4, editable=False, unique=True)


    # Images

    def __str__(self):
        return self.name