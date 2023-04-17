from rest_framework.views import APIView
from rest_framework import status
from rest_framework.response import Response
from lib.exceptions import exceptions, PermissionDenied

from .models import Recipe
from .serializers.common import LandingPageSerializer, RecipeSerializer

from django.contrib.auth import get_user_model
User = get_user_model()

class RecipesListView(APIView):
    # GET RECIPES: GET /api/recipes
    @exceptions
    def get(self, request):
        recipes = Recipe.objects.all()
        serialized_recipes = LandingPageSerializer(recipes, many=True)
        return Response(serialized_recipes.data)
    
    # POST LIKE: POST /api/recipes
    @exceptions
    def post(self, request):
        if request.user.id is None:
            raise PermissionDenied()
        recipe_id = request.data["liked_recipe_id"]
        recipe = Recipe.objects.get(pk=recipe_id)
        # print('USER ID ->', request.user.id)
        if recipe.likes_received.filter(id=request.user.id).exists():
            recipe.likes_received.remove(request.user.id)
        else:
            recipe.likes_received.add(request.user.id)
        recipe.save()
        likes_received = list(recipe.likes_received.values_list('id', flat=True))
        print('RECIPE LIKES_RECEIVED ->', likes_received)
        return Response()

class RecipeDetailedView(APIView):
    # GET RECIPE: GET /api/recipes/:pk
    @exceptions
    def get(self, request, pk):
        print('REQUEST->', request.data)
        recipe = Recipe.objects.get(pk=pk)
        serialized_ingredient = RecipeSerializer(recipe)
        return Response(serialized_ingredient.data)
    
class AddRecipeView(APIView):
    # POST RECIPE: POST /api/recipes/add
    @exceptions
    def post(self, request):
        recipe_to_create = RecipeSerializer(data={ **request.data, 'owner': request.user.id })
        recipe_to_create.is_valid(raise_exception=True)
        recipe_to_create.save()
        return Response(recipe_to_create.data, status.HTTP_201_CREATED)

class EditRecipeView(APIView):
    # PUT RECIPE: PUT /api/recipes/:pk/edit
    @exceptions
    def put(self, request, pk):
        recipe = Recipe.objects.get(pk=pk)
        serialized_recipe = Recipe(recipe, request.data, partial=True)
        serialized_recipe.is_valid(raise_exception=True)
        serialized_recipe.save()
        return Response(serialized_recipe.data)