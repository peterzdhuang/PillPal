from django.shortcuts import render

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.authentication import SessionAuthentication, BasicAuthentication
from rest_framework.permissions import IsAuthenticated
from .models import User
from .serializers import UserSerializer
from rest_framework.permissions import AllowAny

class UserAuthView(APIView):
    authentication_classes = [SessionAuthentication, BasicAuthentication]
    permission_classes = [AllowAny]

    def get(self, request, format=None):
        content = {
            'user': str(request.user),  
            'auth': str(request.auth),  
            'is_caregiver': request.user.is_caregiver,
        }
        return Response(content)

    def post(self, request, *args, **kwargs):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors)