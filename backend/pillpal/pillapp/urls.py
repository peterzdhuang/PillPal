from django.urls import path 
from django.conf import settings
from django.conf.urls.static import static
from . import views 


urlpatterns = [
    path('api/login/', views.LoginAuthView.as_view(), name='login'),
    path('api/signup/', views.UserAuthView.as_view(), name='signup'),
    
    # user endpoints
    path('api/<uuid:user_id>', views.UserSingleView.as_view()),
    
    # medication endpoints
    path('api/<uuid:user_id>/medications', views.AllMedicationsView.as_view()),
    path('api/<uuid:user_id>/medications/<uuid:medication_id>', views.SingleMedicationView.as_view())
]
    path('api/users/', views.AllUsersView.as_view(), name='users'),
    path('api/user/<int:user_id>/', views.GetUserById.as_view(), name='user'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
