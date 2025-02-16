from django.urls import path
from . import views


urlpatterns = [
    path('api/login/', views.LoginAuthView.as_view(), name='login'),
    path('api/signup/', views.UserAuthView.as_view(), name='signup'),
    path('api/users/', views.AllUsersView.as_view(), name='users'),
    path('api/users/<user_id>/medications', views.UserMedication.as_view(), name='user medications'),
    path('api/scan/', views.AnalyzeText.as_view(), name='scan'),
]
