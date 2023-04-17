from .common import UserSerializer
from recipes.serializers.common import RecipeSerializer

class PopulatedUserSerializer(UserSerializer):
    likes_received = RecipeSerializer(many=True)