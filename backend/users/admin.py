from django.contrib import admin

# users/admin.py
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, UserHistory

@admin.register(User)
class CustomUserAdmin(UserAdmin):
    list_display = ['email', 'username', 'get_full_name', 'role', 'is_active', 'date_joined']
    list_filter = ['role', 'is_active', 'is_staff', 'email_verified']
    search_fields = ['email', 'username', 'first_name', 'last_name']
    ordering = ['-date_joined']
    
    fieldsets = (
        (None, {'fields': ('email', 'username', 'password')}),
        ('Información Personal', {'fields': ('first_name', 'last_name', 'phone', 'birth_date', 'avatar')}),
        ('Ubicación', {'fields': ('country', 'city', 'address')}),
        ('Roles y Permisos', {'fields': ('role', 'is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Gamificación', {'fields': ('points', 'level')}),
        ('Preferencias', {'fields': ('receive_newsletter', 'receive_notifications')}),
        ('Verificación', {'fields': ('email_verified', 'phone_verified', 'verification_token')}),
        ('Fechas Importantes', {'fields': ('last_login', 'date_joined')}),
    )
    
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'username', 'password1', 'password2', 'role'),
        }),
    )

@admin.register(UserHistory)
class UserHistoryAdmin(admin.ModelAdmin):
    list_display = ['user', 'action', 'description', 'created_at']
    list_filter = ['action', 'created_at']
    search_fields = ['user__email', 'user__username', 'description']
    readonly_fields = ['created_at']
