# Generated by Django 4.2 on 2023-04-16 14:00

import django.core.validators
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('ingredients', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Constituent',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('unit', models.CharField(max_length=20)),
                ('qty', models.DecimalField(decimal_places=1, max_digits=5)),
                ('name', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='ingredients.ingredient')),
            ],
        ),
        migrations.CreateModel(
            name='Recipe',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=25)),
                ('description', models.TextField(max_length=150)),
                ('continent', models.CharField(max_length=15)),
                ('serves', models.PositiveIntegerField()),
                ('cook_time', models.CharField(max_length=255)),
                ('calories', models.DecimalField(decimal_places=1, max_digits=5)),
                ('fat', models.DecimalField(decimal_places=1, max_digits=5)),
                ('saturates', models.DecimalField(decimal_places=1, max_digits=5)),
                ('sugars', models.DecimalField(decimal_places=1, max_digits=5)),
                ('salt', models.DecimalField(decimal_places=1, max_digits=5)),
                ('protein', models.DecimalField(decimal_places=1, max_digits=5)),
                ('carbohydrates', models.DecimalField(decimal_places=1, max_digits=5)),
                ('fiber', models.DecimalField(decimal_places=1, max_digits=5)),
                ('image', models.URLField(validators=[django.core.validators.URLValidator()])),
                ('method', models.TextField()),
                ('date_posted', models.DateTimeField(auto_now_add=True)),
                ('ingredients', models.ManyToManyField(through='recipes.Constituent', to='ingredients.ingredient')),
            ],
        ),
        migrations.AddField(
            model_name='constituent',
            name='recipe',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='recipes.recipe'),
        ),
    ]
