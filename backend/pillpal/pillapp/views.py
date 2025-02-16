from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.authentication import SessionAuthentication, BasicAuthentication
from rest_framework.permissions import AllowAny
from rest_framework import status
from .models import User
from .serializers import UserSerializer
from django.contrib.auth import authenticate, login

import json
from rest_framework import status
from rest_framework.response import Response
from .scanner import analyze
class UserAuthView(APIView):
    authentication_classes = [SessionAuthentication, BasicAuthentication]
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LoginAuthView(APIView):
    authentication_classes = [SessionAuthentication, BasicAuthentication]
    permission_classes = [AllowAny]

    def post(self, request, format=None):
        username = request.data.get('username')
        password = request.data.get('password')

        # Simulate authentication logic
        try:
            user = User.objects.get(email=username)  # Assuming username is the email
            if user.password == password:  # Check if password matches
                serializer = UserSerializer(user)
                return Response(serializer.data, status=status.HTTP_200_OK)
            else:
                return Response({'error': 'Invalid credentials'}, status=status.HTTP_400_BAD_REQUEST)
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_400_BAD_REQUEST)

class AllUsersView(APIView):
    permission_classes = [AllowAny]

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

            
        users = User.objects.all()
        # Exclude sensitive fields like the password from the returned data.
        user_data = [
            {
                'id': user.id,
                'first_name': user.first_name,
                'last_name': user.last_name,
                'email': user.email,
                'is_caretaker': user.is_caretaker,
                'password': user.password,
            }
            for user in users
        ]
        return Response(user_data)
    
class GetUserById(APIView):
    def get(self, request, user_id, format=None):
        user = User.objects.get(id=user_id)
        user_data = {
            'id': user.id,
            'first_name': user.first_name,
            'last_name': user.last_name,
            'email': user.email,
            'phone': user.phone,
            'is_caretaker': user.is_caretaker,
            'password': user.password,
            'image': user.image.url if user.image else None,
        }
        return Response(user_data)
    
    def post(self, request, user_id):
        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

        firstname = request.data.get('first_name')
        lastname = request.data.get('last_name')
        email = request.data.get('email')
        phone = request.data.get('phone')
        new_password = request.data.get('password')  # New password to set
        current_password = request.data.get('current_password')  # Current password for verification
        image = request.data.get('image')  # Image file

        # Update profile fields if provided.
        if firstname is not None:
            user.first_name = firstname
        if lastname is not None:
            user.last_name = lastname
        if email is not None:
            user.email = email
        if phone is not None:
            user.phone = phone
        if image is not None:
            user.image = image

        # Update password only if a new password was provided.
        if new_password:
            if not current_password:
                return Response({"error": "Current password is required"}, status=status.HTTP_400_BAD_REQUEST)
            if not user.password == current_password:
                return Response({"error": "Current password is incorrect"}, status=status.HTTP_400_BAD_REQUEST)
            user.password = new_password  

        user.save()
        serializer = UserSerializer(user)
        return Response(serializer.data, status=status.HTTP_200_OK)

class UserMedication(APIView):
    def get(self, request, user_id, format=None):
        user = User.objects.get(id=user_id)
        medications = user.medications.all()
        medication_data = [
            {
                'id': medication.id,
                'name': medication.name,
                'dosage': medication.dosage,
                'frequency': medication.frequency,
                'first_dose': medication.first_dose,
                'second_dose': medication.second_dose,
                'quantity': medication.quantity,
            }
            for medication in medications
        ]
        return Response(medication_data)
    
    