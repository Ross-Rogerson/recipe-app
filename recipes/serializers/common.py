from rest_framework.serializers import ModelSerializer, SerializerMethodField
from ..models import Recipe, Constituent
from ingredients.serializers.common import IngredientSerializer


class ConstituentSerializer(ModelSerializer):
    name = IngredientSerializer()

    class Meta:
        model = Constituent
        fields = ('name', 'qty', 'unit')


class RecipeSerializer(ModelSerializer):
    ingredients = ConstituentSerializer(source='constituent_set', many=True)

    class Meta:
        model = Recipe
        fields = '__all__'