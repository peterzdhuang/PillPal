from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from .models import Medication, User
from .serializers import MedicationSerializer, UserSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.authentication import SessionAuthentication, BasicAuthentication

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
    

class AllMedicationsView(generics.ListCreateAPIView):
    """
    View to list all medications for a specific user or create a new one for that user.
    """
    serializer_class = MedicationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """
        Only return medications belonging to the user from the URL.
        """
        user_id = self.kwargs.get('user_id')
        return Medication.objects.filter(user_id=user_id)

    def perform_create(self, serializer):
        """
        Automatically assign the authenticated user to the new medication.
        """
        serializer.save(user=self.request.user)

class SingleMedicationView(generics.RetrieveUpdateDestroyAPIView):
    """
    View to retrieve, update, or delete a single medication for a specific user.
    """
    serializer_class = MedicationSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        """
        Fetch medication only if it belongs to the authenticated user and the user_id in URL.
        """
        user_id = self.kwargs.get('user_id')
        medication_id = self.kwargs.get('medication_id')
        return get_object_or_404(Medication, id=medication_id, user_id=user_id)
