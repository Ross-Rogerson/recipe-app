from django.db import models
from ingredients.models import Ingredient
from django.core.validators import URLValidator
from django.utils import timezone

class Recipe(models.Model):
    name = models.CharField(max_length=50, blank=False)
    description = models.TextField(max_length=150, blank=False)
    continent = models.CharField(max_length=15)
    serves = models.PositiveIntegerField()
    cook_time = models.CharField(max_length=255)
    calories = models.DecimalField(max_digits=5, decimal_places=1, null=True, blank=True)
    fat = models.DecimalField(max_digits=5, decimal_places=1, null=True, blank=True)
    saturates = models.DecimalField(max_digits=5, decimal_places=1, null=True, blank=True)
    sugars = models.DecimalField(max_digits=5, decimal_places=1, null=True, blank=True)
    salt = models.DecimalField(max_digits=5, decimal_places=1, null=True, blank=True)
    protein = models.DecimalField(max_digits=5, decimal_places=1, null=True, blank=True)
    carbohydrates = models.DecimalField(max_digits=5, decimal_places=1, null=True, blank=True)
    fibre = models.DecimalField(max_digits=5, decimal_places=1, null=True, blank=True)
    image = models.URLField(validators=[URLValidator()], blank=False)
    method = models.TextField(blank=False)
    ingredients = models.ManyToManyField(Ingredient, through='Constituent')
    date_posted = models.DateTimeField(default=timezone.now)
    owner = models.ForeignKey(
        'users.User',
        on_delete=models.CASCADE,
        related_name='recipes',
        default=1
    )
    likes_received = models.ManyToManyField('users.User', related_name='liked_by_user')

    def __str__(self):
        return self.name

class Constituent(models.Model):
    ingredient_detail = models.ForeignKey(Ingredient, on_delete=models.CASCADE)
    recipe = models.ForeignKey(Recipe, on_delete=models.CASCADE)
    qty = models.DecimalField(max_digits=5, decimal_places=1, null=True, blank=True)
    unit = models.CharField(max_length=20, null=True, blank=True)