"""
URL configuration for pillpal project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
<<<<<<< HEAD
from django.urls import path, include

import pillapp.urls

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include(pillapp.urls))
=======
from django.urls import path
from pillapp.views import AllMedicationsView, SingleMedicationView

urlpatterns = [
    path('admin/', admin.site.urls),
    
    # medication endpoints
    path('api/<uuid:user_id>/medications', AllMedicationsView.as_view()),
    path('api/<uuid:user_id>/medications/<uuid:medication_id>', SingleMedicationView.as_view())
>>>>>>> b1dd9b59f983113a5d45c23584cfa02a3f23c11c
]
