# users/models.py - Versión verificada
from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager
from django.utils import timezone
from django.core.validators import RegexValidator, MinLengthValidator

class UserManager(BaseUserManager):
    """Manager personalizado para User con métodos de creación escalables"""
    
    def create_user(self, email, username, password=None, **extra_fields):
        if not email:
            raise ValueError('El email es obligatorio')
        if not username:
            raise ValueError('El username es obligatorio')
        
        email = self.normalize_email(email)
        user = self.model(email=email, username=username, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user
    
    def create_superuser(self, email, username, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)
        
        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser debe tener is_staff=True')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser debe tener is_superuser=True')
        
        return self.create_user(email, username, password, **extra_fields)
    
    def create_volunteer(self, email, username, password=None, **extra_fields):
        extra_fields.setdefault('is_volunteer', True)
        return self.create_user(email, username, password, **extra_fields)
    
    def create_donor(self, email, username, password=None, **extra_fields):
        extra_fields.setdefault('is_donor', True)
        return self.create_user(email, username, password, **extra_fields)

class User(AbstractBaseUser, PermissionsMixin):
    """Modelo de Usuario personalizado y escalable."""
    
    class Role(models.TextChoices):
        DONANTE = 'DONANTE', 'Donante'
        VOLUNTARIO = 'VOLUNTARIO', 'Voluntario'
        BENEFICIARIO = 'BENEFICIARIO', 'Beneficiario'
        ALIADO = 'ALIADO', 'Aliado Estratégico'
        ADMIN = 'ADMIN', 'Administrador'
    
    email = models.EmailField(unique=True, verbose_name='Correo electrónico')
    username = models.CharField(
        max_length=50, 
        unique=True,
        validators=[
            RegexValidator(
                regex='^[\\w.@+-]+$',
                message='El username solo puede contener letras, números y @/./+/-/_'
            ),
            MinLengthValidator(3)
        ]
    )
    
    first_name = models.CharField(max_length=50, blank=True)
    last_name = models.CharField(max_length=50, blank=True)
    phone = models.CharField(max_length=15, blank=True, null=True)
    birth_date = models.DateField(null=True, blank=True)
    
    avatar = models.ImageField(
        upload_to='avatars/%Y/%m/', 
        default='avatars/default.png',
        blank=True,
        null=True
    )
    
    country = models.CharField(max_length=100, blank=True)
    city = models.CharField(max_length=100, blank=True)
    address = models.TextField(blank=True)
    
    role = models.CharField(
        max_length=20, 
        choices=Role.choices, 
        default=Role.DONANTE
    )
    
    is_volunteer = models.BooleanField(default=False)
    is_donor = models.BooleanField(default=True)
    is_beneficiary = models.BooleanField(default=False)
    is_partner = models.BooleanField(default=False)
    
    points = models.PositiveIntegerField(default=0, help_text="Puntos de fidelidad")
    level = models.PositiveSmallIntegerField(default=1, help_text="Nivel del usuario")
    
    receive_newsletter = models.BooleanField(default=True)
    receive_notifications = models.BooleanField(default=True)
    
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    date_joined = models.DateTimeField(default=timezone.now)
    last_login = models.DateTimeField(null=True, blank=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    email_verified = models.BooleanField(default=False)
    phone_verified = models.BooleanField(default=False)
    verification_token = models.CharField(max_length=100, blank=True, null=True)
    
    metadata = models.JSONField(default=dict, blank=True, help_text="Datos adicionales flexibles")
    
    objects = UserManager()
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']
    
    class Meta:
        db_table = 'users'
        verbose_name = 'Usuario'
        verbose_name_plural = 'Usuarios'
        indexes = [
            models.Index(fields=['email']),
            models.Index(fields=['username']),
            models.Index(fields=['role']),
            models.Index(fields=['-date_joined']),
        ]
    
    def __str__(self):
        return f"{self.get_full_name() or self.username} ({self.email})"
    
    def get_full_name(self):
        if self.first_name and self.last_name:
            return f"{self.first_name} {self.last_name}"
        return self.username
    
    def get_short_name(self):
        return self.first_name or self.username
    
    def save(self, *args, **kwargs):
        if self.role == self.Role.VOLUNTARIO:
            self.is_volunteer = True
            self.is_donor = False
        elif self.role == self.Role.DONANTE:
            self.is_volunteer = False
            self.is_donor = True
        elif self.role == self.Role.BENEFICIARIO:
            self.is_beneficiary = True
        elif self.role == self.Role.ALIADO:
            self.is_partner = True
        
        super().save(*args, **kwargs)
    
    def add_points(self, points_to_add):
        self.points += points_to_add
        new_level = (self.points // 1000) + 1
        if new_level > self.level:
            self.level = new_level
        self.save(update_fields=['points', 'level'])

class UserHistory(models.Model):
    """Registro histórico de cambios importantes en el usuario"""
    
    ACTION_CHOICES = [
        ('CREATE', 'Creación'),
        ('UPDATE', 'Actualización'),
        ('ROLE_CHANGE', 'Cambio de rol'),
        ('VERIFY_EMAIL', 'Verificación email'),
        ('POINTS_EARNED', 'Ganancia de puntos'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='history')
    action = models.CharField(max_length=20, choices=ACTION_CHOICES)
    description = models.TextField()
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'users_history'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['user', '-created_at']),
        ]
    
    def __str__(self):
        return f"{self.user.email} - {self.action} - {self.created_at}"