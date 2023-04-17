from django.urls import path
from .views import RegisterView, LoginView, IngredientsView, IngredientsDetailedView, ProfileView

urlpatterns = [
    path('register/', RegisterView.as_view()),
    path('login/', LoginView.as_view()),
    path('admin/', IngredientsView.as_view()),
    path('admin/<int:pk>/', IngredientsDetailedView.as_view()),
    path('', ProfileView.as_view()),
]