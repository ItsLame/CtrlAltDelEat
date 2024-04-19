import uuid
from django.db import models
from django.db.models.fields import (
    CharField,
    DecimalField,
    BooleanField,
    URLField,
    UUIDField,
    IntegerField,
)
from django.db.models import ImageField
from taggit.managers import TaggableManager
from taggit.models import TaggedItemBase
import os

# Create your models here.


class Category(models.Model):
    """
    Stores a unique category name (length <=60). Related to :model:`menu.MenuItem`
    """

    category_name = CharField(max_length=60, unique=True)
    uuid = UUIDField(default=uuid.uuid4, editable=False, unique=True)
    position = IntegerField(default=0)

    def __str__(self):
        return self.category_name


class ThroughIngredientTag(TaggedItemBase):
    """
    Intermediate model for storing tags related to menu item ingredients.
    """

    content_object = models.ForeignKey('MenuItem', on_delete=models.CASCADE)


class ThroughTagTag(TaggedItemBase):
    """
    Intermediate model for storing tags related to menu item tags.
    """

    content_object = models.ForeignKey('MenuItem', on_delete=models.CASCADE)


def upload_path(instance, filename):
    """
    Function to define upload path for MenuItemImage instances.
    """
    return os.path.join('images', filename)


class MenuItemImage(models.Model):
    """
    Model representing an image associated with a menu item.
    """

    image = ImageField(upload_to=upload_path, blank=True, null=True)


class MenuItem(models.Model):
    """
    Model representing a menu item

    Stores a unique menu item name (length <=60), cost (max 8 digits),
    description (max 255 chars), available flag, list of categories,
    list of ingredients, list of tags and image URL. Related to :model:`menu.Category`
    """

    menuitem_name = CharField(max_length=60, unique=True)
    cost = DecimalField(max_digits=8, decimal_places=2)
    description = CharField(max_length=255)
    available = BooleanField()
    category = models.ManyToManyField(Category, help_text='URL for category')
    ingredients = TaggableManager(
        blank=False,
        through=ThroughIngredientTag,
        related_name='ingredient_tags',
    )
    tags = TaggableManager(
        blank=True, through=ThroughTagTag, related_name='tag_tags'
    )
    uuid = UUIDField(default=uuid.uuid4, editable=False, unique=True)
    image = URLField(max_length=300, blank=True, null=True)
    position = IntegerField(default=0)

    def __str__(self):
        return self.menuitem_name
