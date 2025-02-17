import json
from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.shortcuts import get_object_or_404
from .models import Medication, User, CaretakerVerification, PatientLog
from .serializers import MedicationSerializer, UserSerializer, PatientLogSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.authentication import SessionAuthentication, BasicAuthentication
from django.contrib.auth import authenticate, login
from .scanner import analyze
from django.views.decorators.csrf import ensure_csrf_cookie
from django.http import JsonResponse
from django.core import signing


# Import Django's email functions and settings
from django.core.mail import send_mail
from django.conf import settings

@ensure_csrf_cookie
def csrf_token_view(request):
    return JsonResponse({'detail': 'CSRF cookie set.'})

def generate_verification_token(caretaker_email, patient_email):
    data = {
        "caretaker_email": caretaker_email,
        "patient_email": patient_email,
    }
    # 'verify-patient' is a salt that adds an extra layer of security.
    token = signing.dumps(data, salt="verify-patient")
    return token


class UserAuthView(APIView):
    authentication_classes = [SessionAuthentication, BasicAuthentication]
    permission_classes = [AllowAny]  # Allow anyone to sign up

    def post(self, request, *args, **kwargs):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()

            # Check if a patient email was provided (even though it's not part of the User model)
            patient_email = request.data.get("patient_email")
            if patient_email:
                # Generate a token using the user's email and the provided patient email
                verification_token = generate_verification_token(user.email, patient_email)

                # Save the verification token (adjust your model fields as needed)
                CaretakerVerification.objects.create(
                    token=verification_token,
                    caretaker_email=user.email,  # The user who signed up is the caretaker
                    patient_email=patient_email  # The provided patient email
                )

                # Compose the verification email and send it to the patient
                verification_link = f"http://localhost:8000/api/verify_patient/?token={verification_token}"
                email_subject = "Patient Verification Request"
                email_message = (
                    f"Hello,\n\n"
                    f"{user.first_name} {user.last_name} has requested to add you as a patient. "
                    f"Please click the following link to verify your consent: {verification_link}\n\n"
                    f"Thank you!"
                )
                send_mail(
                    email_subject,
                    email_message,
                    settings.DEFAULT_FROM_EMAIL,
                    [patient_email],
                    fail_silently=False,
                )

            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class VerifyPatientView(APIView):
    permission_classes = []  # Allow any user (even if unauthenticated) to verify

    def get(self, request, format=None):
        token = request.GET.get("token")
        if not token:
            return Response({"error": "Missing token."}, status=status.HTTP_400_BAD_REQUEST)
        
        # Verify and decode the token using Django's signing module.
        try:
            # 'verify-patient' is the salt we used when generating the token.
            # max_age sets an expiration time in seconds (e.g. 86400 = 24 hours)
            data = signing.loads(token, salt="verify-patient", max_age=86400)
        except signing.SignatureExpired:
            return Response({"error": "Token expired."}, status=status.HTTP_400_BAD_REQUEST)
        except signing.BadSignature:
            return Response({"error": "Invalid token."}, status=status.HTTP_400_BAD_REQUEST)
        
        # Extract the emails from the decoded token.
        caretaker_email = data.get("caretaker_email")
        patient_email = data.get("patient_email")
        
        # Optionally, if you have a verification record in your database, check it.
        try:
            verification = CaretakerVerification.objects.get(token=token)
            if verification.is_verified:
                return Response({"detail": "This verification has already been completed."}, status=status.HTTP_400_BAD_REQUEST)
        except CaretakerVerification.DoesNotExist:
            verification = None
        
        # Find the patient user by their email.
        try:
            patient = User.objects.get(email=patient_email)
        except User.DoesNotExist:
            return Response({"error": "Patient user not found."}, status=status.HTTP_404_NOT_FOUND)
        
        # Update the patient's caretaker_email field.
        patient.caretaker_email = caretaker_email
        patient.save()
        
        # If a verification record exists, mark it as verified.
        if verification:
            verification.is_verified = True
            verification.save()
        
        return Response({"detail": "Patient verified successfully."}, status=status.HTTP_200_OK)
    
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
                'caretaker_email': user.caretaker_email,
                'image': user.image.url if user.image else None,
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
            'image': caretaker_user.image.url if caretaker_user.image else None,
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
                'last_taken': medication.last_taken,
                'refills_remaining': medication.refills_remaining,
                'directions': medication.directions,
                'date_prescribed': medication.date_prescribed,

            }
            for medication in medications
        ]
        return Response(medication_data)
    
    def post(self, request, user_id, format=None):
        user = get_object_or_404(User, id=user_id)
        name = request.data.get('name')
        dosage = request.data.get('dosage')
        frequency = request.data.get('frequency')
        first_dose = request.data.get('first_dose')
        second_dose = request.data.get('second_dose')
        quantity = request.data.get('quantity')
        last_taken = request.data.get('last_taken')
        refills_remaining = request.data.get('refills_remaining')
        directions = request.data.get('directions')
        
        # Parse the last_taken date (or use current time if not provided)
        if last_taken:
            try:
                last_taken_dt = datetime.fromisoformat(last_taken)
            except Exception as e:
                return Response(
                    {'error': 'Invalid last_taken date format. Please use ISO format.'},
                    status=status.HTTP_400_BAD_REQUEST
                )
        else:
            last_taken_dt = datetime.now()
            last_taken = last_taken_dt.isoformat()
        
        # Calculate the next due date based on frequency
        if frequency:
            frequency = frequency.lower()
            if frequency == "daily":
                next_due = last_taken_dt + timedelta(days=1)
            elif frequency == "weekly":
                next_due = last_taken_dt + timedelta(weeks=1)
            elif frequency == "monthly":
                next_due = last_taken_dt + relativedelta(months=1)
            else:
                next_due = last_taken_dt + timedelta(days=1)
        else:
            next_due = last_taken_dt + timedelta(days=1)
        
        # The computed next due date will be stored in date_prescribed.
        date_prescribed = next_due.isoformat()
        
        medication = Medication.objects.create(
            user=user,
            name=name,
            dosage=dosage,
            frequency=frequency,
            first_dose=first_dose,
            second_dose=second_dose,
            quantity=quantity,
            last_taken=last_taken,
            refills_remaining=refills_remaining,
            directions=directions,
            date_prescribed=date_prescribed,
        )
        medication.save()
        return Response(
            {
                'success': 'Medication added',
                'medication': {
                    'id': medication.id,
                    'name': medication.name,
                    'dosage': medication.dosage,
                    'frequency': medication.frequency,
                    'first_dose': medication.first_dose,
                    'second_dose': medication.second_dose,
                    'quantity': medication.quantity,
                    'last_taken': medication.last_taken,
                    'refills_remaining': medication.refills_remaining,
                    'directions': medication.directions,
                    'date_prescribed': medication.date_prescribed,
                }
            },
            status=status.HTTP_201_CREATED
        )
    
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
    
    
class PatientLogListCreateAPIView(generics.ListCreateAPIView):
    """
    GET: List all PatientLog entries.
    POST: Create a new PatientLog entry.
    """
    queryset = PatientLog.objects.all()
    serializer_class = PatientLogSerializer

class PatientLogRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    """
    GET: Retrieve a PatientLog entry.
    PUT: Update a PatientLog entry.
    PATCH: Partially update a PatientLog entry.
    DELETE: Delete a PatientLog entry.
    """
    queryset = PatientLog.objects.all()
    serializer_class = PatientLogSerializer

class CaretakerUsersView(APIView):
    def get(self, request, caretaker_id):
        """
        Retrieve all users who have the specified caretaker's email as their caretaker_email.
        
        Args:
            request: Django HTTP request object
            caretaker_id (int): The ID of the caretaker user
            
        Returns:
            JsonResponse: A JSON response containing user information for all users under the caretaker
        """

        try:
            # Get the caretaker user
            caretaker = User.objects.get(id=caretaker_id)
            
            # Get all users who have this caretaker's email as their caretaker_email
            users = User.objects.filter(caretaker_email=caretaker.email)
            
            # Format the response data
            users_data = []
            for user in users:
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
                users_data.append(user_data)
                
            return JsonResponse(users_data, safe=False)
            
        except ObjectDoesNotExist:
            return JsonResponse([], safe=False)
        except Exception as e:
            # Log the error here if needed
            return JsonResponse(
                {"error": "An error occurred while fetching users"}, 
                status=500
            )
