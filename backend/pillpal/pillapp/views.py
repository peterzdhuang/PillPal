from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from .models import Medication
from .serializer import MedicationSerializer

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
