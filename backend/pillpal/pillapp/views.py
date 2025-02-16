from django.shortcuts import render

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.authentication import SessionAuthentication, BasicAuthentication
from rest_framework.permissions import IsAuthenticated
from .models import User
from .serializers import UserSerializer
import json
from rest_framework import status
from rest_framework.response import Response
from .scanner import analyze
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

class AnalyzeText(APIView):
    # Remove authentication and permission classes
    authentication_classes = []
    permission_classes = []

    def post(self, request, *args, **kwargs):
        try:
            input_text = request.data.get('text', '')
            print(input_text)
            if not input_text:
                return Response(
                    {'error': 'No text provided'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Perform text analysis
            analysis_result = analyze.analyze_text(input_text)
            
            if not analysis_result:
                return Response(
                    {'error': 'Failed to analyze text'},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )

            return Response({
                'success': True,
                'data': analysis_result
                # Removed user field from response
            }, status=status.HTTP_200_OK)

        except json.JSONDecodeError:
            return Response(
                {'error': 'Invalid JSON format'},
                status=status.HTTP_400_BAD_REQUEST
            )
            
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

            