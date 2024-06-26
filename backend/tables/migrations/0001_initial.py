# Generated by Django 5.0.3 on 2024-04-15 10:10

import uuid
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Tables',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('tableNumber', models.IntegerField()),
                ('request_assistance', models.BooleanField(default=True)),
                ('uuid', models.UUIDField(default=uuid.uuid4, editable=False, unique=True)),
                ('timestamp', models.TimeField(auto_now_add=True)),
            ],
        ),
    ]
