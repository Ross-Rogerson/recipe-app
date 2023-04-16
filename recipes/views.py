from rest_framework.views import APIView
from rest_framework import status
from rest_framework.response import Response
from lib.exceptions import exceptions

from .models import Recipe
from .serializers.common import RecipeSerializer

class RecipesListView(APIView):
    # GET RECIPES: GET /api/
    @exceptions
    def get(self, request):
        recipes = Recipe.objects.all()
        serialized_recipes = RecipeSerializer(recipes, many=True)
        return Response(serialized_recipes.data)