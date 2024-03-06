# Generated by Django 4.2.9 on 2024-03-04 06:49

from django.db import migrations, models
import django.db.models.deletion
import menu.models
import taggit.managers
import uuid


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('taggit', '0006_rename_taggeditem_content_type_object_id_taggit_tagg_content_8fc721_idx'),
    ]

    operations = [
        migrations.CreateModel(
            name='Category',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=60, unique=True)),
                ('uuid', models.UUIDField(default=uuid.uuid4, editable=False, unique=True)),
                ('ordering', models.FloatField(default=menu.models.Category.num_items)),
            ],
        ),
        migrations.CreateModel(
            name='Ingredient',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=60, unique=True)),
                ('uuid', models.UUIDField(default=uuid.uuid4, editable=False, unique=True)),
            ],
        ),
        migrations.CreateModel(
            name='Tag',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=60, unique=True)),
                ('uuid', models.UUIDField(default=uuid.uuid4, editable=False, unique=True)),
            ],
        ),
        migrations.CreateModel(
            name='MenuItem',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=60)),
                ('cost', models.DecimalField(decimal_places=2, max_digits=8)),
                ('description', models.CharField(max_length=255)),
                ('available', models.BooleanField()),
                ('ordering', models.FloatField(default=menu.models.MenuItem.num_items)),
                ('uuid', models.UUIDField(default=uuid.uuid4, editable=False, unique=True)),
                ('category', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='menu.category')),
                ('ingredients', models.ManyToManyField(to='menu.ingredient')),
                ('tags', taggit.managers.TaggableManager(help_text='A comma-separated list of tags.', through='taggit.TaggedItem', to='taggit.Tag', verbose_name='Tags')),
            ],
        ),
    ]
