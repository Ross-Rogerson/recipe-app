import jwt
from rest_framework.authentication import BaseAuthentication
from django.conf import settings
from django.contrib.auth import get_user_model
User = get_user_model()

class JWTAuthentication(BaseAuthentication):

    def authenticate(self, request):
        if not request.headers:
            return None
        
        
        print('AUTHENTICATION ATTEMPTED')
        print(request.headers)
        auth_header = request.headers.get('Authorization')
        if not auth_header:
            return None
        if not auth_header.startswith('Bearer'):
            return None
        token = auth_header.replace('Bearer ', '')
        try:
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms='HS256')
            user = User.objects.get(pk=payload.get('sub'))
        except jwt.exceptions.InvalidSignatureError as e:
            print(e.__class__.__name__)
            print(e)
            return None
        except User.DoesNotExist as e:
            print(e.__class__.__name__)
            print(e)
            return None
        
        return (user, token)