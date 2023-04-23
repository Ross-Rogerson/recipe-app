from rest_framework.serializers import ModelSerializer, SerializerMethodField, BooleanField, ListField, DecimalField, CharField, DictField, JSONField, Serializer
from ..models import Recipe, Constituent
from ingredients.serializers.common import IngredientSerializer
from ingredients.models import Ingredient
from django.db import transaction
from rest_framework.serializers import PrimaryKeyRelatedField

class ConstituentSerializer(ModelSerializer):
    ingredient_detail = IngredientSerializer()

    class Meta:
        model = Constituent
        fields = ('ingredient_detail', 'qty', 'unit')


class RecipeSerializer(ModelSerializer):
    ingredients = ConstituentSerializer(source='constituent_set', many=True, read_only=True)
    is_vegan = BooleanField(read_only=True)
    is_vegetarian = BooleanField(read_only=True)
    is_gluten_free = BooleanField(read_only=True)


    class Meta:
        model = Recipe
        fields = '__all__'

class LandingPageSerializer(ModelSerializer):
    class Meta:
        model = Recipe
        fields = (
            'id',
            'name', 
            'description', 
            'continent', 
            'calories', 
            'protein', 
            'carbohydrates',
            'image',
            'owner',
            'likes_received'
            )
        
class ProfilePageSerializer(ModelSerializer):
    class Meta:
        model = Recipe
        fields = (
            'name',
            'image',
            'date_posted',
            'likes_received',
            'owner',
            'id'
            )
        
class FridgeRecipeSerializer(ModelSerializer):
    class Meta:
        model = Recipe
        fields = (
            'name',
            'description',
            'image',
            'id'
            )

class IngredientInRecipeSerializer(ModelSerializer):
    ingredient_detail = PrimaryKeyRelatedField(queryset=Ingredient.objects.all())
    qty = DecimalField(max_digits=5, decimal_places=1, allow_null=True, required=False)
    unit = CharField(allow_blank=True, required=False)

    class Meta:
        model = Constituent
        fields = ('ingredient_detail', 'qty', 'unit')



class CreateRecipeSerializer(ModelSerializer):
    ingredients = ListField(child=DictField(), write_only=True, required=False)

    class Meta:
        model = Recipe
        fields = '__all__'

    def create(self, validated_data):
        ingredients_data = validated_data.pop('ingredients', [])

        with transaction.atomic():
            recipe = Recipe.objects.create(**validated_data)

            for ingredient_data in ingredients_data:
                ingredient_id = ingredient_data['ingredient_detail']
                ingredient_detail = Ingredient.objects.get(id=ingredient_id)
                qty = ingredient_data.get('qty', None)
                unit = ingredient_data['unit']

                Constituent.objects.create(
                    recipe=recipe,
                    ingredient_detail=ingredient_detail,
                    qty=qty,
                    unit=unit
                )

        return recipe

class UpdateRecipeSerializer(ModelSerializer):
    ingredients = ListField(child=DictField(), write_only=True, required=False)

    class Meta:
        model = Recipe
        fields = '__all__'

    def update(self, instance, validated_data):
        ingredients_data = validated_data.pop('ingredients', [])

        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        instance.constituent_set.all().delete()

        for ingredient_data in ingredients_data:
            ingredient_id = ingredient_data['ingredient_detail']
            ingredient_detail = Ingredient.objects.get(id=ingredient_id)
            qty = ingredient_data['qty']
            unit = ingredient_data['unit']

            Constituent.objects.create(
                recipe=instance,
                ingredient_detail=ingredient_detail,
                qty=qty,
                unit=unit
            )

        return instance