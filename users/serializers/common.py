from rest_framework import serializers
from django.contrib.auth import get_user_model, password_validation, hashers

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):

    password = serializers.CharField(write_only=True)
    password_confirmation = serializers.CharField(write_only=True)

    def validate(self, data):
        password = data.pop('password')
        password_confirmation = data.pop('password_confirmation')
        if password != password_confirmation:
            raise serializers.ValidationError(
                {'password_confirmation': 'Does not match password'})
        password_validation.validate_password(password)
        data['password'] = hashers.make_password(password)
        return data

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'profile_image',
                  'password', 'password_confirmation')


class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'profile_image', 'is_staff', 'is_superuser', 'liked_by_user', 'recipes')


class AdminSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'is_staff', 'is_superuser', 'ingredients')
