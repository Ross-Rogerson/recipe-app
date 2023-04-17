from rest_framework.serializers import ModelSerializer, SerializerMethodField
from ..models import Recipe, Constituent
from ingredients.serializers.common import IngredientSerializer


class ConstituentSerializer(ModelSerializer):
    ingredient_detail = IngredientSerializer()

    class Meta:
        model = Constituent
        fields = ('ingredient_detail', 'qty', 'unit')


class RecipeSerializer(ModelSerializer):
    ingredients = ConstituentSerializer(source='constituent_set', many=True)

    class Meta:
        model = Recipe
        fields = '__all__'

class LandingPageSerializer(ModelSerializer):
    class Meta:
        model = Recipe
        fields = (
            'name', 
            'description', 
            'continent', 
            'calories', 
            'protein', 
            'carbohydrates',
            'image',
            'likes_received'
            )
        
class ProfilePageSerializer(ModelSerializer):
    class Meta:
        model = Recipe
        fields = (
            'name',
            'image',
            'date_posted',
            'likes_received',
            'owner',
            'id'
            )
        
class FridgeRecipeSerializer(ModelSerializer):
    class Meta:
        model = Recipe
        fields = (
            'name',
            'description',
            'image',
            'id'
            )