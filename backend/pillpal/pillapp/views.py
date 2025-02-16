from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.authentication import SessionAuthentication, BasicAuthentication
from rest_framework.permissions import AllowAny
from rest_framework import status
from .models import User
from .serializers import UserSerializer
from django.contrib.auth import authenticate, login

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

        # Update profile fields if provided.
        if firstname is not None:
            user.first_name = firstname
        if lastname is not None:
            user.last_name = lastname
        if email is not None:
            user.email = email
        if phone is not None:
            user.phone = phone

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
    
    