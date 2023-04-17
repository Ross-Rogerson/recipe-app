from functools import wraps
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError, NotFound, PermissionDenied
from django.core.exceptions import ImproperlyConfigured
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from rest_framework import status
from django.contrib.auth import get_user_model
User = get_user_model()

def exceptions(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        try:
            return func(*args, **kwargs)
        except (User.DoesNotExist, PermissionDenied) as e:
            print(e.__class__.__name__)
            print(e)
            return Response({ 'detail': 'Unauthorized' }, status.HTTP_403_FORBIDDEN)
        except (NotFound) as e:
            print(e.__class__.__name__)
            print(e)
            return Response(e.__dict__ if e.__dict__ else { 'detail': str(e) }, status.HTTP_404_NOT_FOUND)
        except (ValidationError, ImproperlyConfigured) as e:
            print(e.__class__.__name__)
            print(e)
            return Response(e.__dict__ if e.__dict__ else { 'detail': str(e) }, status.HTTP_422_UNPROCESSABLE_ENTITY)
        except Exception as e:
            print(e.__class__.__name__)
            print(e)
            return Response(e.__dict__ if e.__dict__ else { 'detail': str(e) }, status.HTTP_500_INTERNAL_SERVER_ERROR)
    return wrapper

# def auth_decorator(func):
#     @wraps(func)
#     def wrapper(request, *args, **kwargs):
#         if not request.headers:
#             return Response({'detail': 'Login to like posts.'}, status=status.HTTP_401_UNAUTHORIZED)
        
#         auth_header = request.headers.get('Authorization')

#         if not auth_header:
#             return Response({'detail': 'Login to like posts.'}, status=status.HTTP_401_UNAUTHORIZED)

#         if not auth_header or not auth_header.startswith('Token '):
#             return Response({'detail': 'Login to like posts.'}, status=status.HTTP_401_UNAUTHORIZED)
#         # return func(request, *args, **kwargs)
#     return wrapper