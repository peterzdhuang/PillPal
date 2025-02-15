from rest_framework import serializers
from .models import User

class UserSerializer(serializers.ModelSerializer):
    followers = serializers.PrimaryKeyRelatedField(many=True, queryset=User.objects.all(), required=False)

    class Meta:
        model = User
        fields = '__all__'
"""
class PillSerializer(serializers.ModelSerializer):
    class Meta:
        model = Pill
        fields = '__all__'
"""
