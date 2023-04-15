from django.db import models

class Ingredient(models.Model):
    name = models.CharField(max_length=50)
    plural = models.CharField(max_length=52)
    category = models.CharField(max_length=20)
    substitutes = models.CharField(max_length=150)
    vegan = models.BooleanField()
    vegetarian = models.BooleanField()
    gluten_free = models.BooleanField()
    owner = models.ForeignKey(
        'users.User',
        on_delete=models.CASCADE,
        related_name='ingredients',
        default=1
    )

    def __str__(self):
        return self.name
    
    