# Generated by Django 4.2 on 2023-04-17 09:41

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('recipes', '0007_recipe_likes_received'),
    ]

    operations = [
        migrations.RenameField(
            model_name='constituent',
            old_name='name',
            new_name='ingredient_detail',
        ),
    ]
