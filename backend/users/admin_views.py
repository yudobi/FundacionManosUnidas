"""Endpoints admin para gestionar usuarios registrados."""
from django.db.models import Q
from rest_framework import permissions, status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from drf_spectacular.utils import extend_schema

from .models import User
from .serializers import UserSerializer


class IsAdminUserRole(permissions.BasePermission):
    """Permite acceso solo a usuarios con role=ADMIN o is_superuser=True."""

    def has_permission(self, request, view):
        user = request.user
        if not user or not user.is_authenticated:
            return False
        return getattr(user, 'is_admin_role', False)


@extend_schema(tags=['admin-users'])
class UserAdminViewSet(viewsets.ModelViewSet):
    """CRUD limitado de usuarios para el panel admin.

    Filtros vía query params:
        ?role=DONANTE
        ?is_active=true|false
        ?q=texto  (busca en email/username/first_name/last_name)
    """

    queryset = User.objects.all().order_by('-date_joined')
    serializer_class = UserSerializer
    permission_classes = (IsAdminUserRole,)

    def get_queryset(self):
        qs = super().get_queryset()
        role = self.request.query_params.get('role')
        if role:
            qs = qs.filter(role=role)
        active = self.request.query_params.get('is_active')
        if active in ('true', 'false'):
            qs = qs.filter(is_active=(active == 'true'))
        search = self.request.query_params.get('q')
        if search:
            qs = qs.filter(
                Q(email__icontains=search)
                | Q(username__icontains=search)
                | Q(first_name__icontains=search)
                | Q(last_name__icontains=search)
            )
        return qs

    def create(self, request, *args, **kwargs):
        return Response(
            {'detail': 'Usa /api/users/register/ para crear usuarios.'},
            status=status.HTTP_405_METHOD_NOT_ALLOWED,
        )

    @action(detail=True, methods=['post'])
    def deactivate(self, request, pk=None):
        user = self.get_object()
        if user.is_superuser:
            return Response(
                {'detail': 'No se puede desactivar a un superusuario.'},
                status=status.HTTP_400_BAD_REQUEST,
            )
        user.is_active = False
        user.save(update_fields=['is_active'])
        return Response(self.get_serializer(user).data)

    @action(detail=True, methods=['post'])
    def activate(self, request, pk=None):
        user = self.get_object()
        user.is_active = True
        user.save(update_fields=['is_active'])
        return Response(self.get_serializer(user).data)

    @action(detail=True, methods=['post'], url_path='set-role')
    def set_role(self, request, pk=None):
        user = self.get_object()
        new_role = (request.data.get('role') or '').strip()
        valid = [r[0] for r in User.Role.choices]
        if new_role not in valid:
            return Response(
                {'detail': f'Rol inválido. Opciones: {valid}'},
                status=status.HTTP_400_BAD_REQUEST,
            )
        if user.pk == request.user.pk and new_role != User.Role.ADMIN:
            return Response(
                {'detail': 'No puedes cambiar tu propio rol de admin desde aquí.'},
                status=status.HTTP_400_BAD_REQUEST,
            )
        user.role = new_role
        user.save(update_fields=['role'])
        return Response(self.get_serializer(user).data)
