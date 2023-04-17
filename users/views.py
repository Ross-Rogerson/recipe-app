import jwt

from rest_framework.views import APIView
from rest_framework.response import Response
from .serializers.common import UserSerializer
from rest_framework import status
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from rest_framework.exceptions import PermissionDenied
from datetime import datetime, timedelta
from django.conf import settings

from lib.exceptions import exceptions

from ingredients.models import Ingredient
from ingredients.serializers.common import IngredientSerializer
from ingredients.serializers.populated import PopulatedIngredientSerializer

from recipes.models import Recipe
from recipes.serializers.common import ProfilePageSerializer

from django.contrib.auth import get_user_model
User = get_user_model()

# REGISTER ROUTE: POST /api/auth/register/
class RegisterView(APIView):
    @exceptions
    def post(self, request):
        user_to_add = UserSerializer(data=request.data)
        user_to_add.is_valid(raise_exception=True)
        user_to_add.save()
        return Response(user_to_add.data, status.HTTP_201_CREATED)

# LOGIN ROUTE: POST /api/auth/login/
class LoginView(APIView):
    @exceptions
    def post(self, request):
        print('LOGIN ATTEMPT RECEIVED')
        email = request.data['email']
        password = request.data['password']
        user_to_login = User.objects.get(email=email)
        if not user_to_login.check_password(password):
            print("Passwords don't match")
            raise PermissionDenied('Unauthorized')

        dt = datetime.now() + timedelta(days=7)

        token = jwt.encode({'sub':  user_to_login.id, 'exp': int(
            dt.strftime('%s'))}, settings.SECRET_KEY, algorithm='HS256')
        print('TOKEN ->', token)

        return Response({'message': f"Welcome back, {user_to_login.username}", 'token': token})

    
class ProfileView(APIView):
    permission_classes = (IsAuthenticated,)
    # GET RECIPES: GET /api/profile/
    # Gets both recipes liked and owned
    @exceptions
    def get(self, request):
        recipes_owned = Recipe.objects.filter(owner=request.user)
        recipes_liked = Recipe.objects.filter(likes_received=request.user)
        recipes = (recipes_owned | recipes_liked).distinct()
        serialized_recipes = ProfilePageSerializer(recipes, many=True)
        return Response(serialized_recipes.data)
    
    @exceptions
    def delete(self, request):
        # recipe_id will be sent from the front end in the request body
        recipe_id = request.data["recipe_id"]
        recipe_to_delete = Recipe.objects.get(pk=recipe_id)
        if recipe_to_delete.owner != request.user:
            raise PermissionDenied()
        recipe_to_delete.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    
class IngredientsView(APIView):
    permission_classes = (IsAdminUser,)
    # GET INGREDIENTS: GET /api/admin
    @exceptions
    def get(self, request):
        ingredients = Ingredient.objects.filter(owner=request.user)
        serialized_ingredients = IngredientSerializer(ingredients, many=True)
        print('REQUEST DATA ->', request.user)
        return Response(serialized_ingredients.data)

    # CREATE INGREDIENTS: POST /api/admin
    @exceptions
    def post(self, request):
        print('REQUEST DATA ->', { **request.data, 'owner': request.user.id })
        ingredient_to_create = IngredientSerializer(data={ **request.data, 'owner': request.user.id })
        ingredient_to_create.is_valid(raise_exception=True)
        ingredient_to_create.save()
        return Response(ingredient_to_create.data, status.HTTP_201_CREATED)
    
class IngredientsDetailedView(APIView):
    permission_classes = (IsAdminUser,)

    # GET INGREDIENT: GET /api/profile/admin/:pk
    @exceptions
    def get(self, request, pk):
        print('REQUEST->', request.data)
        ingredient = Ingredient.objects.get(pk=pk)
        if ingredient.owner != request.user:
            raise PermissionDenied()
        serialized_ingredient = PopulatedIngredientSerializer(ingredient)
        return Response(serialized_ingredient.data)
    
    # PUT INGREDIENT: PUT /api/profile/admin/:pk
    @exceptions
    def put(self, request, pk):
        ingredient = Ingredient.objects.get(pk=pk)
        serialized_ingredient = IngredientSerializer(ingredient, request.data, partial=True)
        serialized_ingredient.is_valid(raise_exception=True)
        serialized_ingredient.save()
        return Response(serialized_ingredient.data)
    
    # DELETE INGREDIENT: DELETE /api/profile/admin/:pk
    @exceptions
    def delete(self, request, pk):
        ingredient_to_delete = Ingredient.objects.get(pk=pk)
        if ingredient_to_delete.owner != request.user:
            raise PermissionDenied()
        ingredient_to_delete.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)