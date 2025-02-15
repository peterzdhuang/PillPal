from rest_framework import serializers
from .models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'

# class PillSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Pill
#         fields = '__all__'
