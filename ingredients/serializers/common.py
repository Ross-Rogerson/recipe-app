from rest_framework.serializers import ModelSerializer
from ..models import Ingredient

class IngredientSerializer(ModelSerializer):
    class Meta:
        model = Ingredient
        fields = '__all__'

class FridgeIngredientSerializer(ModelSerializer):
    class Meta:
        model = Ingredient
        fields = ('name', 'plural')