from .common import RecipeSerializer
from users.serializers.common import UserSerializer

class PopulatedRecipeSerializer(RecipeSerializer):
    likes_received = UserSerializer(many=True)
    owner = UserSerializer()