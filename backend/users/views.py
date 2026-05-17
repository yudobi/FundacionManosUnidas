from django.shortcuts import render

# users/views.py
# users/views.py
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from drf_spectacular.utils import extend_schema, OpenApiParameter, OpenApiExample, OpenApiResponse
from drf_spectacular.types import OpenApiTypes
from .models import User, UserHistory
from .serializers import (
    UserSerializer, 
    RegisterSerializer, 
    ChangePasswordSerializer, 
    UserProfileUpdateSerializer,
    UserHistorySerializer
)


@extend_schema(
    tags=['auth'],
    summary='Iniciar sesión',
    description='Autentica un usuario y devuelve tokens JWT junto con los datos del usuario',
    request={
        'application/json': {
            'type': 'object',
            'properties': {
                'email': {'type': 'string', 'format': 'email', 'example': 'usuario@ejemplo.com'},
                'password': {'type': 'string', 'format': 'password', 'example': 'MiPassword123!'}
            },
            'required': ['email', 'password']
        }
    },
    responses={
        200: OpenApiResponse(
            description='Login exitoso',
            response={
                'type': 'object',
                'properties': {
                    'refresh': {'type': 'string'},
                    'access': {'type': 'string'},
                    'user': {'type': 'object'}
                }
            }
        ),
        401: OpenApiResponse(description='Credenciales inválidas'),
    }
)
class CustomTokenObtainPairView(TokenObtainPairView):
    """Login que retorna token + datos del usuario"""
    
    def post(self, request, *args, **kwargs):
        email = request.data.get('email')
        password = request.data.get('password')
        
        user = authenticate(email=email, password=password)
        
        if not user:
            return Response(
                {'error': 'Credenciales inválidas'}, 
                status=status.HTTP_401_UNAUTHORIZED
            )
        
        if not user.is_active:
            return Response(
                {'error': 'Usuario inactivo'}, 
                status=status.HTTP_401_UNAUTHORIZED
            )
        
        refresh = RefreshToken.for_user(user)
        
        # Registrar login en historial
        UserHistory.objects.create(
            user=user,
            action='UPDATE',
            description="Inicio de sesión",
            ip_address=request.META.get('REMOTE_ADDR')
        )
        
        return Response({
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'user': UserSerializer(user).data
        })


@extend_schema(
    tags=['users'],
    summary='Registro de usuario',
    description='Crea una nueva cuenta de usuario en la plataforma',
    request=RegisterSerializer,
    responses={
        201: OpenApiResponse(
            description='Usuario registrado exitosamente',
            response=UserSerializer
        ),
        400: OpenApiResponse(description='Datos inválidos'),
    }
)
class RegisterView(generics.CreateAPIView):
    """Registro de nuevos usuarios"""
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]
    
    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        
        # Generar token automáticamente después del registro
        refresh = RefreshToken.for_user(user)
        
        return Response({
            'message': 'Usuario registrado exitosamente',
            'user': UserSerializer(user).data,
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }, status=status.HTTP_201_CREATED)


@extend_schema(
    tags=['profile'],
    summary='Obtener perfil',
    description='Retorna el perfil completo del usuario autenticado',
    responses={
        200: UserSerializer,
        401: OpenApiResponse(description='No autenticado'),
    }
)
class UserProfileView(generics.RetrieveUpdateAPIView):
    """Obtener y actualizar perfil de usuario autenticado"""
    permission_classes = [permissions.IsAuthenticated]
    
    def get_object(self):
        return self.request.user
    
    def get_serializer_class(self):
        if self.request.method == 'GET':
            return UserSerializer
        return UserProfileUpdateSerializer


@extend_schema(
    tags=['profile'],
    summary='Actualizar perfil',
    description='Actualiza parcial o totalmente los datos del perfil',
    request=UserProfileUpdateSerializer,
    responses={
        200: UserSerializer,
        400: OpenApiResponse(description='Datos inválidos'),
    }
)
class UserProfileUpdateView(generics.UpdateAPIView):
    """Actualizar perfil de usuario"""
    serializer_class = UserProfileUpdateSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_object(self):
        return self.request.user


@extend_schema(
    tags=['auth'],
    summary='Cambiar contraseña',
    description='Permite al usuario autenticado cambiar su contraseña',
    request=ChangePasswordSerializer,
    responses={
        200: OpenApiResponse(description='Contraseña actualizada'),
        400: OpenApiResponse(description='Error de validación'),
    }
)
class ChangePasswordView(APIView):
    """Cambiar contraseña del usuario autenticado"""
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request):
        serializer = ChangePasswordSerializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        
        user = request.user
        user.set_password(serializer.validated_data['new_password'])
        user.save()
        
        # Registrar cambio en historial
        UserHistory.objects.create(
            user=user,
            action='UPDATE',
            description="Cambio de contraseña",
            ip_address=request.META.get('REMOTE_ADDR')
        )
        
        return Response({'message': 'Contraseña actualizada exitosamente'})


@extend_schema(
    tags=['auth'],
    summary='Cerrar sesión',
    description='Invalida el refresh token para cerrar la sesión',
    request={
        'application/json': {
            'type': 'object',
            'properties': {
                'refresh': {'type': 'string', 'description': 'Refresh token'}
            },
            'required': ['refresh']
        }
    },
    responses={
        200: OpenApiResponse(description='Sesión cerrada'),
        400: OpenApiResponse(description='Token inválido'),
    }
)
class LogoutView(APIView):
    """Cerrar sesión (blacklist del refresh token)"""
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request):
        try:
            refresh_token = request.data.get('refresh')
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response({'message': 'Sesión cerrada exitosamente'})
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


@extend_schema(
    tags=['profile'],
    summary='Historial de usuario',
    description='Obtiene el historial de acciones del usuario autenticado',
    responses={200: UserHistorySerializer(many=True)}
)
class UserHistoryView(generics.ListAPIView):
    """Ver historial de acciones del usuario (para transparencia)"""
    serializer_class = UserHistorySerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return UserHistory.objects.filter(user=self.request.user)


@extend_schema(
    tags=['profile'],
    summary='Estadísticas del usuario',
    description='Obtiene métricas y estadísticas del usuario (puntos, nivel, etc.)',
    responses={
        200: {
            'type': 'object',
            'properties': {
                'total_points': {'type': 'integer', 'example': 1500},
                'level': {'type': 'integer', 'example': 2},
                'points_to_next_level': {'type': 'integer', 'example': 500},
                'member_since': {'type': 'string', 'format': 'date-time'},
                'role': {'type': 'string', 'example': 'DONANTE'},
                'email_verified': {'type': 'boolean'},
                'history_count': {'type': 'integer', 'example': 5}
            }
        }
    }
)
class UserStatsView(APIView):
    """Estadísticas del usuario (para dashboard)"""
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request):
        user = request.user
        return Response({
            'total_points': user.points,
            'level': user.level,
            'points_to_next_level': (user.level * 1000) - user.points,
            'member_since': user.date_joined,
            'role': user.role,
            'email_verified': user.email_verified,
            'history_count': user.history.count(),
        })