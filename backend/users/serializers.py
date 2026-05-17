# users/serializers.py
# users/serializers.py - Versión CORREGIDA
from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from django.core.validators import EmailValidator, RegexValidator
from .models import User, UserHistory


class UserSerializer(serializers.ModelSerializer):
    """Serializer principal de usuario con campos controlados"""
    
    full_name = serializers.SerializerMethodField()
    password = serializers.CharField(write_only=True, required=False)
    
    class Meta:
        model = User
        fields = [
            'id', 'email', 'username', 'first_name', 'last_name', 'full_name',
            'phone', 'birth_date', 'avatar', 'country', 'city', 'address',
            'role', 'points', 'level', 'date_joined', 'receive_newsletter',
            'receive_notifications', 'email_verified', 'phone_verified',
            'is_active', 'is_staff', 'is_superuser',
            'is_volunteer', 'is_donor', 'is_beneficiary', 'is_partner',
            'password',
        ]
        read_only_fields = [
            'id', 'points', 'level', 'date_joined', 'email_verified',
            'phone_verified', 'is_staff', 'is_superuser',
        ]
        extra_kwargs = {
            'password': {'write_only': True, 'required': False}
        }
    
    def get_full_name(self, obj):
        return obj.get_full_name()
    
    def validate_email(self, value):
        """Validación de email único y formato"""
        validator = EmailValidator()
        validator(value)
        
        if self.instance:
            if User.objects.exclude(id=self.instance.id).filter(email=value).exists():
                raise serializers.ValidationError("Este email ya está registrado")
        else:
            if User.objects.filter(email=value).exists():
                raise serializers.ValidationError("Este email ya está registrado")
        return value
    
    def validate_username(self, value):
        """Validación de username único y caracteres permitidos"""
        validator = RegexValidator(
            regex='^[\\w.@+-]+$',
            message='El username solo puede contener letras, números y @/./+/-/_'
        )
        validator(value)
        
        if self.instance:
            if User.objects.exclude(id=self.instance.id).filter(username=value).exists():
                raise serializers.ValidationError("Este username ya está en uso")
        else:
            if User.objects.filter(username=value).exists():
                raise serializers.ValidationError("Este username ya está en uso")
        return value
    
    def validate_password(self, value):
        """Validación de fortaleza de contraseña"""
        if value:
            validate_password(value)
        return value
    
    def create(self, validated_data):
        password = validated_data.pop('password', None)
        user = User(**validated_data)
        if password:
            user.set_password(password)
        user.save()
        
        UserHistory.objects.create(
            user=user,
            action='CREATE',
            description=f"Usuario creado con rol {user.role}"
        )
        
        return user
    
    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)
        old_role = instance.role
        
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        
        if password:
            instance.set_password(password)
        
        instance.save()
        
        if old_role != instance.role:
            UserHistory.objects.create(
                user=instance,
                action='ROLE_CHANGE',
                description=f"Rol cambiado de {old_role} a {instance.role}"
            )
        
        return instance


class RegisterSerializer(serializers.ModelSerializer):
    """Serializer específico para registro con validaciones extra"""
    
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True)
    
    class Meta:
        model = User
        fields = ['email', 'username', 'first_name', 'last_name', 'password', 'password2', 'role']
    
    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Las contraseñas no coinciden"})
        return attrs
    
    def create(self, validated_data):
        validated_data.pop('password2')
        user = User.objects.create_user(**validated_data)
        return user


class ChangePasswordSerializer(serializers.Serializer):
    """Serializer para cambio de contraseña"""
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True, validators=[validate_password])
    
    def validate_old_password(self, value):
        user = self.context['request'].user
        if not user.check_password(value):
            raise serializers.ValidationError("Contraseña actual incorrecta")
        return value


class UserProfileUpdateSerializer(serializers.ModelSerializer):
    """Serializer para actualización de perfil sin password"""
    
    class Meta:
        model = User
        fields = ['first_name', 'last_name', 'phone', 'birth_date', 'avatar', 
                  'country', 'city', 'address', 'receive_newsletter', 
                  'receive_notifications']


class UserHistorySerializer(serializers.ModelSerializer):
    """Serializer para el historial de usuarios"""
    
    class Meta:
        model = UserHistory
        fields = ['id', 'action', 'description', 'ip_address', 'created_at']
        read_only_fields = ['id', 'action', 'description', 'ip_address', 'created_at']  # ← CORREGIDO: es una lista