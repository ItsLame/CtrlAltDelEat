import uuid
from django.db import models
from django.db.models.fields import (
    CharField,
    DecimalField,
    BooleanField,
    URLField,
    UUIDField,
)
from taggit.managers import TaggableManager
from taggit.models import TaggedItemBase

# Create your models here.


class Category(models.Model):
    """ 
    Stores a unique category name (length <=60). Related to :model:`menu.MenuItem`
    """
    category_name = CharField(max_length=60, unique=True)
    uuid = UUIDField(default=uuid.uuid4, editable=False, unique=True)

    def __str__(self):
        return self.category_name


class ThroughIngredientTag(TaggedItemBase):
    content_object = models.ForeignKey('MenuItem', on_delete=models.CASCADE)


class ThroughTagTag(TaggedItemBase):
    content_object = models.ForeignKey('MenuItem', on_delete=models.CASCADE)


class MenuItem(models.Model):
    """ 
    Stores a unique menu item name (length <=60), cost (max 8 digits), 
    description (max 255 chars), available flag, list of categories, 
    list of ingredients, list of tags and image URL. Related to :model:`menu.Category`
    """
    menuitem_name = CharField(max_length=60, unique=True)
    cost = DecimalField(max_digits=8, decimal_places=2)
    description = CharField(max_length=255)
    available = BooleanField()
    category = models.ManyToManyField(Category, help_text="URL for category")
    ingredients = TaggableManager(
        blank=False,
        through=ThroughIngredientTag,
        related_name='ingredient_tags',
    )
    tags = TaggableManager(
        blank=True, through=ThroughTagTag, related_name='tag_tags'
    )
    uuid = UUIDField(default=uuid.uuid4, editable=False, unique=True)
    image = URLField(max_length=200, blank=True)

    def __str__(self):
        return self.menuitem_name
