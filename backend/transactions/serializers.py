from django.contrib.auth.models import User
from rest_framework import serializers 
from .models import Category, Transaction

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'password']
        extra_kwargs = {'password': {'write_only' : True}}

    def create(self, validated_data):
            user = User.objects.create_user(**validated_data)
            return user

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'user', 'name','color','icon']
        extra_kwargs = {'user': {'read_only':True}}

class TransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transaction
        fields = ['id', 'user', 'category', 'type', 'amount', 'note', 'date', 'created_at', 'updated_at']
        extra_kwargs = {'user': {'read_only': True}}
