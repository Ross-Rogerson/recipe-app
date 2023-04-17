from django.urls import path
from .views import FridgeView

urlpatterns = [
    path('', FridgeView.as_view()),
]