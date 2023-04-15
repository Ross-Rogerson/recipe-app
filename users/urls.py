from django.urls import path
from .views import RegisterView, LoginView, IngredientsView, IngredientsDetailedView

urlpatterns = [
    path('register/', RegisterView.as_view()),
    path('login/', LoginView.as_view()),
    path('admin/', IngredientsView.as_view()),
    path('admin/<int:pk>/', IngredientsDetailedView.as_view()),
]