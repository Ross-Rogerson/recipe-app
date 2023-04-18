from django.urls import path
from .views import RegisterView, LoginView, IngredientsView, IngredientsDetailedView, ProfileView, CreateIngredientView

urlpatterns = [
    path('register/', RegisterView.as_view()),
    path('login/', LoginView.as_view()),
    path('<int:pk>/admin/', IngredientsView.as_view()),
    path('admin/ingredients/<int:pk>/', IngredientsDetailedView.as_view()),
    path('<int:pk>/', ProfileView.as_view()),
    path('admin/ingredients/add', CreateIngredientView.as_view()),
]