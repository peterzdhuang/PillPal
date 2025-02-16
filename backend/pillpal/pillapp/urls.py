from django.urls import path
from . import views


urlpatterns = [
    path('api/login/', views.UserAuthView.as_view(), name='login'),
    path('api/signup/', views.UserAuthView.as_view(), name='signup'),
    
    # user endpoints
    path('api/<uuid:user_id>', views.UserSingleView.as_view()),
    
    # medication endpoints
    path('api/<uuid:user_id>/medications', views.AllMedicationsView.as_view()),
    path('api/<uuid:user_id>/medications/<uuid:medication_id>', views.SingleMedicationView.as_view())
]
