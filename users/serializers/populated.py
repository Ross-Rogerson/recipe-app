from .common import ProfileSerializer
from recipes.serializers.common import RecipeSerializer

class PopulatedUserSerializer(ProfileSerializer):
    liked_by_user = RecipeSerializer(many=True)
    recipes = RecipeSerializer(many=True)