from rest_framework import serializers
from .models import User, Medication

class UserSerializer(serializers.ModelSerializer):
    followers = serializers.PrimaryKeyRelatedField(many=True, queryset=User.objects.all(), required=False)

    class Meta:
        model = User
        fields = '__all__'


class MedicationSerializer(serializers.ModelSerializer):
    #user = serializers.PrimaryKeyRelatedField(many=True, queryset=User.objects.all(), required=False)
    user = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())
    

    class Meta:
        model = Medication
        fields = '__all__'
