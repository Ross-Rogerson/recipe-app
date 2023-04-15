from django.urls import path
from .views import Ing

# Any request hitting this urlpatterns list is: /api/sightings/
# urlpatterns = [
#     path('', SightingListView.as_view()), # /api/sightings/
#     path('<int:pk>/', .as_view()) # /api/sightings/:pk
# ]