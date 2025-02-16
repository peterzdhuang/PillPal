from rest_framework import serializers
from .models import User

class UserSerializer(serializers.ModelSerializer):
    followers = serializers.PrimaryKeyRelatedField(many=True, queryset=User.objects.all(), required=False)

    class Meta:
        model = User
        fields = '__all__'
        
    def validate(self, data):
        """Ensure only caretakers have a patient email and non-caretakers don't."""
        is_caretaker = data.get('is_caretaker', False)
        patient_email = data.get('patient_email')

        if is_caretaker and not patient_email:
            raise serializers.ValidationError("Caretakers must have a patient email.")

        if not is_caretaker and patient_email:
            raise serializers.ValidationError("Only caretakers can have a patient email.")

        return data
"""
class PillSerializer(serializers.ModelSerializer):
    class Meta:
        model = Pill
        fields = '__all__'
"""

class MedicationSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())

    class Meta:
        model = Medication
        fields = '__all__'
