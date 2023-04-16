from django.urls import path
from .views import RecipesListView

urlpatterns = [
    path('', RecipesListView.as_view()),
]