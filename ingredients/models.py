from django.db import models

class Ingredient(models.Model):
    name = models.CharField(max_length=50, blank=False)
    plural = models.CharField(max_length=52, blank=False)
    category = models.CharField(max_length=20, blank=False)
    substitutes = models.CharField(max_length=150, blank=False)
    vegan = models.BooleanField(blank=False)
    vegetarian = models.BooleanField(blank=False)
    gluten_free = models.BooleanField(blank=False)
    owner = models.ForeignKey(
        'users.User',
        on_delete=models.CASCADE,
        related_name='ingredients',
        default=1
    )

    def __str__(self):
        return self.name
    
    