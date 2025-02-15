from rest_framework import serializers
from .models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'
    
    def create(self, validated_data):
        password = validated_data.pop('password', None)
        user = User(**validated_data)
        if password:
            user.password = password
        user.save()
        return user
        

# class PillSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Pill
#         fields = '__all__'
