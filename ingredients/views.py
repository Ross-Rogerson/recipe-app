from rest_framework.views import APIView
from rest_framework import status
from rest_framework.response import Response
from lib.exceptions import exceptions

from .models import Ingredient
from .serializers.common import FridgeIngredientSerializer, IngredientSerializer

from recipes.models import Recipe
from recipes.serializers.common import FridgeRecipeSerializer

class FridgeView(APIView):
    # GET RECIPES: GET /api/fridge/
    @exceptions
    def get(self, request):
        ingredients = Ingredient.objects.all()
        serialized_ingredients = FridgeIngredientSerializer(ingredients, many=True)
        return Response(serialized_ingredients.data)
    
    # POST INGREDIENTS: POST /api/fridge/
    # filters recipes and only those including ingredients
    @exceptions
    def post(self, request):
        ingredient_ids = request.data.values()
        print('REQUEST DATA ->', ingredient_ids)
        recipes = Recipe.objects.all()
        for ingredient_id in ingredient_ids:
            recipes = recipes.filter(ingredients__id=ingredient_id)
        serialized_recipes = FridgeRecipeSerializer(recipes, many=True)
        return Response(serialized_recipes.data)