# Generated by Django 4.2 on 2023-04-18 15:51

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('recipes', '0009_recipe_vegan'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='recipe',
            name='vegan',
        ),
    ]
