import json
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from .models import Medication, User
from .serializers import MedicationSerializer, UserSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.authentication import SessionAuthentication, BasicAuthentication
from rest_framework.permissions import AllowAny
from rest_framework import status
from django.contrib.auth import authenticate, login
from .scanner import analyze
from rest_framework import status
from django.views.decorators.csrf import ensure_csrf_cookie
from rest_framework.response import Response
from django.http import JsonResponse

@ensure_csrf_cookie
def csrf_token_view(request):
    return JsonResponse({'detail': 'CSRF cookie set.'})
class UserAuthView(APIView):
    authentication_classes = [SessionAuthentication, BasicAuthentication]
    permission_classes = [IsAuthenticated]

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
    
class UserSingleView(generics.RetrieveUpdateDestroyAPIView):
    
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]
    
    def get_object(self):
        user_id = self.kwargs.get('user_id')
        return get_object_or_404(User, id=user_id)

class AllMedicationsView(generics.ListCreateAPIView):
    serializer_class = MedicationSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        user_id = self.kwargs['user_id']  # The user ID passed in the URL path
        return Medication.objects.filter(user_id=user_id)

    def perform_create(self, serializer):
        """Automatically assign the authenticated user"""
        try:
            serializer.save(user=self.request.user)
        except Exception as e:
            raise e

    def create(self, request, *args, **kwargs):
        """Handle the scan data format"""
        # Map frontend fields to your serializer fields if needed
        data = request.data.copy()
        serializer = MedicationSerializer(data=request.data)
        serializer.is_valid()
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)

class SingleMedicationView(generics.RetrieveUpdateDestroyAPIView):
    """
    View to retrieve, update, or delete a single medication for a specific user.
    """
    serializer_class = MedicationSerializer

    def get_object(self):
        """
        Fetch medication only if it belongs to the authenticated user and the user_id in URL.
        """
        user_id = self.kwargs.get('user_id')
        medication_id = self.kwargs.get('medication_id')
        return get_object_or_404(Medication, id=medication_id, user_id=user_id)

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
            'notifications': user.notifications,
            'caretaker_email': user.caretaker_email,
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
        notifications = request.data.get('notifications')  # Notification settings
        caretaker_email = request.data.get('caretaker_email') 

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
        if notifications is not None:
            if isinstance(notifications, str):
                if notifications.lower() == "true":
                    user.notifications = True
                else:
                    user.notifications = False
            else:
                user.notifications = notifications
        if caretaker_email is not None:
            caretaker = User.objects.get(email=caretaker_email)
            if not caretaker_email and caretaker.is_caretaker == False:
                return Response({"error": "Caretaker email not found"}, status=status.HTTP_404_NOT_FOUND)
            user.caretaker_email = caretaker_email

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
    
class CareTaker(APIView):
    """
    CRUD on caretaker relationship for a specific user via /api/caretaker/<int:user_id>/
    """

    def get(self, request, user_id, format=None):
        """
        GET caretaker info for the given user_id.
        """
        user = get_object_or_404(User, id=user_id)
        caretaker_user = User.objects.get(email=user.caretaker_email)
        if not caretaker_user:
            return Response({"detail": "No caretaker assigned."}, status=status.HTTP_404_NOT_FOUND)
        
        caretaker_data = {
            "id": caretaker_user.id,
            "first_name": caretaker_user.first_name,
            "last_name": caretaker_user.last_name,
            "email": caretaker_user.email,
            "phone": caretaker_user.phone,
        }
        return Response(caretaker_data, status=status.HTTP_200_OK)

    def post(self, request, user_id, format=None):
        """
        POST to assign a new caretaker by email (if caretaker isn't assigned yet).
        """
        user = get_object_or_404(User, id=user_id)
        caretaker_email = request.data.get("caretaker_email")
        if not caretaker_email or caretaker_email == user.email:
            return Response({"error": "Invalid caretaker email."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            caretaker_user = User.objects.get(email=caretaker_email)
        except User.DoesNotExist:
            return Response({"error": "Caretaker user does not exist."}, status=status.HTTP_404_NOT_FOUND)

        # Optionally check caretaker_user.is_caretaker == True, etc.
        user.caretaker_email = caretaker_user.email
        user.save()

        caretaker_data = {
            "id": caretaker_user.id,
            "first_name": caretaker_user.first_name,
            "last_name": caretaker_user.last_name,
            "email": caretaker_user.email,
            "phone": caretaker_user.phone,
        }
        return Response(caretaker_data, status=status.HTTP_201_CREATED)

    def patch(self, request, user_id, format=None):
        """
        PATCH to update caretaker email (if caretaker is already assigned or to change caretaker).
        """
        user = get_object_or_404(User, id=user_id)
        caretaker_email = request.data.get("caretaker_email")
        if not caretaker_email:
            return Response({"error": "Caretaker email is required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            caretaker_user = User.objects.get(email=caretaker_email)
        except User.DoesNotExist:
            return Response({"error": "Caretaker user does not exist."}, status=status.HTTP_404_NOT_FOUND)

        user.caretaker_email = caretaker_user
        user.save()

        caretaker_data = {
            "id": caretaker_user.id,
            "first_name": caretaker_user.first_name,
            "last_name": caretaker_user.last_name,
            "email": caretaker_user.email,
            "phone": caretaker_user.phone,
        }
        return Response(caretaker_data, status=status.HTTP_200_OK)

    def delete(self, request, user_id, format=None):
        """
        DELETE to remove caretaker assignment from the user (set caretaker_email=None).
        """
        user = get_object_or_404(User, id=user_id)
        user.caretaker_email = None
        user.save()
        return Response({"detail": "Caretaker removed."}, status=status.HTTP_204_NO_CONTENT)

class UserMedication(APIView): # this wont work, i changed the model - peter
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
    
class AnalyzeText(APIView):
    # Remove authentication and permission classes
    authentication_classes = []
    permission_classes = []

    def post(self, request, *args, **kwargs):
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