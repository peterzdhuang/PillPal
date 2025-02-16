from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.authentication import SessionAuthentication, BasicAuthentication
from rest_framework.permissions import AllowAny
from rest_framework import status
from .models import User
from .serializers import UserSerializer

class UserAuthView(APIView):
    authentication_classes = [SessionAuthentication, BasicAuthentication]
    permission_classes = [AllowAny]

    def get(self, request, format=None):
        if request.user.is_authenticated:
            content = {
                'user': str(request.user),
                'is_caretaker': request.user.is_caretaker,
            }
        else:
            content = {
                'user': None,
                'is_caretaker': False,
            }
        return Response(content)

    def post(self, request, *args, **kwargs):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

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