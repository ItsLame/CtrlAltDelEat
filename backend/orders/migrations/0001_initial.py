# Generated by Django 5.0.3 on 2024-04-07 09:26

import uuid
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Order',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('tableNumber', models.IntegerField()),
                ('itemName', models.CharField(max_length=60)),
                ('cost', models.DecimalField(decimal_places=2, max_digits=8)),
                ('status', models.CharField(max_length=15)),
                ('alterations', models.TextField()),
                ('timestamp', models.TimeField(auto_now_add=True)),
                ('uuid', models.UUIDField(default=uuid.uuid4, editable=False, unique=True)),
            ],
        ),
    ]
