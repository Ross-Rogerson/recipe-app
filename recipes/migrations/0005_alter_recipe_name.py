# Generated by Django 4.2 on 2023-04-16 15:59

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('recipes', '0004_rename_fiber_recipe_fibre'),
    ]

    operations = [
        migrations.AlterField(
            model_name='recipe',
            name='name',
            field=models.CharField(max_length=50),
        ),
    ]
