from django.urls import path
from .views import AllMedicationsView, SingleMedicationView

from . import views


urlpatterns = [
    path('api/login/', views.UserAuthView.as_view(), name='login'),
    path('api/signup/', views.UserAuthView.as_view(), name='signup'),
    # medication endpoints
    path('api/<uuid:user_id>/medications', AllMedicationsView.as_view()),
    path('api/<uuid:user_id>/medications/<uuid:medication_id>', SingleMedicationView.as_view())
]
