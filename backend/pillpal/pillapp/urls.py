from django.urls import path 
from django.conf import settings
from django.conf.urls.static import static
from . import views 
from .views import csrf_token_view, AllMedicationsView


urlpatterns = [
    path('api/login/', views.LoginAuthView.as_view(), name='login'),
    path('api/signup/', views.UserAuthView.as_view(), name='signup'),
    
    # medication endpoints
    path('api/users/', views.AllUsersView.as_view(), name='users'),
    path('api/user/<int:user_id>/', views.GetUserById.as_view(), name='user'),
    path('api/scan/', views.AnalyzeText.as_view(), name='scan'),
    path('api/medications/<int:user_id>', AllMedicationsView.as_view(), name='medications-list'),
    path('api/medications/', AllMedicationsView.as_view(), name='medications-list'),
    path('api/csrf_token/', csrf_token_view, name="csrf_token"),

] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
