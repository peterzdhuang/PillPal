from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from .models import Medication
from .serializer import MedicationSerializer

class AllMedicationsView(generics.ListCreateAPIView):
    """
    View to list all medications or create a new one.
    """
    queryset = Medication.objects.all()
    serializer_class = MedicationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """
        Only return medications belonging to the authenticated user.
        """
        return Medication.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        """
        Automatically assign the authenticated user to the new medication.
        """
        serializer.save(user=self.request.user)

class SingleMedicationView(generics.RetrieveUpdateDestroyAPIView):
    """
    View to retrieve, update, or delete a single medication.
    """
    queryset = Medication.objects.all()
    serializer_class = MedicationSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        """
        Fetch medication only if it belongs to the authenticated user.
        """
        medication_id = self.kwargs.get("medication_id")
        return get_object_or_404(Medication, id=medication_id, user=self.request.user)