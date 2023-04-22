from django.urls import path
from .views import RecipeDetailedView, EditRecipeView, RecipesInList, AddRecipeView, RecipesListView

urlpatterns = [
    path('', RecipesListView.as_view()),
    path('recipes/<int:pk>/', RecipeDetailedView.as_view()),
    path('recipes/<int:pk>/edit/', EditRecipeView.as_view()),
    path('recipes/add/', AddRecipeView.as_view()),
    path('recipes/', RecipesInList.as_view()),
]