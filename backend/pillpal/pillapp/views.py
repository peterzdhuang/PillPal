from django.shortcuts import render

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.authentication import SessionAuthentication, BasicAuthentication
from rest_framework.permissions import IsAuthenticated
from .models import User
from .serializers import UserSerializer

class UserAuthView(APIView):
    authentication_classes = [SessionAuthentication, BasicAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, format=None):
        content = {
            'user': str(request.user),  
            'auth': str(request.auth),  
            'is_caregiver': request.user.is_caregiver,
        }
        return Response(content)

    def post(self, request, *args, **kwargs):
        user = User.objects.get(username=request.user)
        user.is_caregiver = not user.is_caregiver
        user.save()
        return Response(status=200)
    
