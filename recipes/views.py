from rest_framework.views import APIView
from rest_framework import status
from rest_framework.response import Response
from lib.exceptions import exceptions, PermissionDenied

from .models import Recipe, Constituent
from .serializers.common import CreateRecipeSerializer, FridgeRecipeSerializer, UpdateRecipeSerializer
from .serializers.populated import PopulatedRecipeSerializer
from rest_framework.permissions import IsAdminUser, IsAuthenticated, IsAuthenticatedOrReadOnly

from ingredients.models import Ingredient
from ingredients.serializers.common import IngredientSerializer

from users.serializers.populated import PopulatedUserSerializer

from django.contrib.auth import get_user_model
User = get_user_model()


class RecipesListView(APIView):
    permission_classes = (IsAuthenticatedOrReadOnly,)
    # GET RECIPES: GET /api/recipes

    @exceptions
    def get(self, request):
        recipes = Recipe.objects.all()
        serialized_recipes = PopulatedRecipeSerializer(recipes, many=True)
        return Response(serialized_recipes.data)

    # POST LIKE: POST /api/recipes
    @exceptions
    def post(self, request):
        recipe_id = request.data["liked_recipe_id"]
        recipe = Recipe.objects.get(pk=recipe_id)
        if recipe.likes_received.filter(id=request.user.id).exists():
            recipe.likes_received.remove(request.user)
        else:
            recipe.likes_received.add(request.user)
        recipe.save()
        return Response()


class RecipeDetailedView(APIView):
    # GET RECIPE: GET /api/recipes/:pk
    @exceptions
    def get(self, request, pk):
        recipe = Recipe.objects.get(pk=pk)
        serialized_recipe = PopulatedRecipeSerializer(recipe)
        return Response(serialized_recipe.data)

    # GET RECIPE: GET /api/recipes/:pk
    @exceptions
    def post(self, request, pk):
        print('RECEIVED')
        # recipe_id = request.data["liked_recipe_id"]
        recipe = Recipe.objects.get(pk=pk)
        if recipe.likes_received.filter(id=request.user.id).exists():
            recipe.likes_received.remove(request.user)
        else:
            recipe.likes_received.add(request.user)
        recipe.save()
        print(recipe)
        return Response()


class AddRecipeView(APIView):
    permission_classes = (IsAuthenticated,)
    # POST RECIPE: POST /api/recipes/add
    # GET RECIPES: GET /api/recipe/add

    @exceptions
    def get(self, request):
        ingredients = Ingredient.objects.all()
        serialized_ingredients = IngredientSerializer(ingredients, many=True)
        return Response(serialized_ingredients.data)

    @exceptions
    def post(self, request):
        print(request.data)
        recipe_to_create = CreateRecipeSerializer(
            data={**request.data, 'owner': request.user.id})
        recipe_to_create.is_valid(raise_exception=True)
        recipe_to_create.save()
        return Response(recipe_to_create.data, status.HTTP_201_CREATED)


class EditRecipeView(APIView):
    # Edit recipe owned from recipe detailed view
    permission_classes = (IsAuthenticated,)
    # PUT RECIPE: PUT /api/recipes/:pk/edit
    @exceptions
    def get(self, request, pk):
        recipe = Recipe.objects.get(pk=pk)
        if recipe.owner != request.user:
            raise PermissionDenied()
        serialized_recipe = PopulatedRecipeSerializer(recipe)

        ingredients = Ingredient.objects.all()
        serialized_ingredients = IngredientSerializer(ingredients, many=True)

        response_data = {
            'recipe': serialized_recipe.data,
            'ingredients': serialized_ingredients.data
        }
        return Response(response_data)

    @exceptions
    def put(self, request, pk):
        print(request.data)
        recipe = Recipe.objects.get(pk=pk)
        if recipe.owner != request.user:
            raise PermissionDenied()

        serialized_recipe = UpdateRecipeSerializer(recipe, data=request.data, partial=True)
        serialized_recipe.is_valid(raise_exception=True)
        serialized_recipe.save()

        return Response(serialized_recipe.data)

class RecipesInList(APIView):
    # Recipes in shopping list
    # POST RECIPE: POST /api/shopping/
    @exceptions
    def post(self, request):
        # Array of recipe IDs will be sent from front end
        recipe_ids = request.data.get("recipes", [])
        print('PRINTED THIS ->', recipe_ids)
        recipes = Recipe.objects.filter(id__in=recipe_ids)
        serialized_recipes = FridgeRecipeSerializer(recipes, many=True)
        return Response(serialized_recipes.data)
