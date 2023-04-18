from .common import ProfileSerializer, AdminSerializer
from recipes.serializers.common import RecipeSerializer
from ingredients.serializers.common import IngredientSerializer

class PopulatedUserSerializer(ProfileSerializer):
    liked_by_user = RecipeSerializer(many=True)
    recipes = RecipeSerializer(many=True)

class PopulatedAdminSerializer(AdminSerializer):
    ingredients = IngredientSerializer(many=True)