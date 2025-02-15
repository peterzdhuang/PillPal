from django.urls import path
from . import views


urlpatterns = [
    path('api/login/', views.UserAuthView.as_view(), name='login'),
    path('api/signup/', views.UserAuthView.as_view(), name='signup'),
]
