import uuid
from django.db import models
from django.db.models.fields import (
    CharField,
    DecimalField,
    BooleanField,
    URLField,
    UUIDField,
    IntegerField
)

from django.db.models import ImageField
from taggit.managers import TaggableManager
from taggit.models import TagBase, GenericTaggedItemBase
from taggit.forms import TagField
import os
from django.utils.translation import gettext_lazy as _
# Create your models here.


class TagTag(TagBase):
    class Meta:
        verbose_name = _("Tag")
        verbose_name_plural = _("Tags")

class IngredientTag(TagBase):
    class Meta:
        verbose_name = _("Ingredient")
        verbose_name_plural = _("Ingredients")


class Category(models.Model):
    """ 
    Stores a unique category name (length <=60). Related to :model:`menu.MenuItem`
    """
    category_name = CharField(max_length=60, unique=True)
    uuid = UUIDField(default=uuid.uuid4, editable=False, unique=True)
    position = IntegerField(default=0)

    def __str__(self):
        return self.category_name


class ThroughIngredientTag(GenericTaggedItemBase):
    tag = models.ForeignKey(IngredientTag, on_delete=models.CASCADE, related_name="%(app_label)s_%(class)s_items",)


class ThroughTagTag(GenericTaggedItemBase):
    tag = models.ForeignKey(TagTag, on_delete=models.CASCADE, related_name="%(app_label)s_%(class)s_items",)

def upload_path(instance, filename):
    return os.path.join("images", filename)

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
        blank=True,
        through=ThroughIngredientTag,
        related_name="menuitem_ingredients"
    )
    tags = TaggableManager(
        blank=True, through=ThroughTagTag, related_name="menuitem_tag"
    )
    uuid = UUIDField(default=uuid.uuid4, editable=False, unique=True)
    image = ImageField(upload_to=upload_path, blank=True, null=True)
    position = IntegerField(default=0)
    # image = URLField(max_length=200, blank=True)

    def __str__(self):
        return self.menuitem_name