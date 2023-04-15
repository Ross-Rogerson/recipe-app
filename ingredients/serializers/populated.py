from .common import IngredientSerializer
from users.serializers.common import UserSerializer

class PopulatedIngredientSerializer(IngredientSerializer):
    owner = UserSerializer()