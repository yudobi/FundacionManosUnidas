# proyectos/views.py - Agrega esta importación al inicio
from django.shortcuts import get_object_or_404
from rest_framework import viewsets, permissions, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from drf_spectacular.utils import extend_schema, extend_schema_view, OpenApiResponse
from .models import (
    CategoriaProyecto, ProyectoRealizado, ImagenAntesDespues,
    GaleriaProyectoRealizado, ProyectoEnProgreso, NecesidadEspecifica,
    GaleriaProyectoProgreso, ActualizacionProyecto
)
from .serializers import (
    CategoriaProyectoSerializer, ProyectoRealizadoSerializer,
    ProyectoRealizadoListSerializer, ImagenAntesDespuesSerializer,
    GaleriaProyectoRealizadoSerializer, ProyectoEnProgresoSerializer,
    ProyectoEnProgresoListSerializer, NecesidadEspecificaSerializer,
    GaleriaProyectoProgresoSerializer, ActualizacionProyectoSerializer
)


@extend_schema_view(
    list=extend_schema(summary="Listar categorías", tags=["Proyectos - Categorías"]),
    create=extend_schema(summary="Crear categoría", tags=["Proyectos - Categorías"]),
    retrieve=extend_schema(summary="Obtener categoría", tags=["Proyectos - Categorías"]),
    update=extend_schema(summary="Actualizar categoría", tags=["Proyectos - Categorías"]),
    partial_update=extend_schema(summary="Actualizar parcial", tags=["Proyectos - Categorías"]),
    destroy=extend_schema(summary="Eliminar categoría", tags=["Proyectos - Categorías"]),
)
class CategoriaProyectoViewSet(viewsets.ModelViewSet):
    queryset = CategoriaProyecto.objects.filter(is_active=True)
    serializer_class = CategoriaProyectoSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    search_fields = ['name', 'description']


@extend_schema_view(
    list=extend_schema(
        summary="Listar proyectos realizados",
        description="Lista todos los proyectos realizados publicados",
        tags=["Proyectos - Realizados"]
    ),
    create=extend_schema(
        summary="Crear proyecto realizado",
        tags=["Proyectos - Realizados"],
        description="Requiere permisos de administrador"
    ),
    retrieve=extend_schema(
        summary="Obtener proyecto realizado",
        tags=["Proyectos - Realizados"]
    ),
    update=extend_schema(
        summary="Actualizar proyecto realizado",
        tags=["Proyectos - Realizados"]
    ),
    partial_update=extend_schema(
        summary="Actualizar parcial",
        tags=["Proyectos - Realizados"]
    ),
    destroy=extend_schema(
        summary="Eliminar proyecto realizado",
        tags=["Proyectos - Realizados"]
    ),
)
class ProyectoRealizadoViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['categoria', 'impacto_nivel', 'is_published']
    search_fields = ['title', 'description', 'location']
    ordering_fields = ['end_date', 'start_date', 'views', 'likes', 'beneficiarios']
    
    def get_queryset(self):
        if self.request.user.is_staff:
            return ProyectoRealizado.objects.all()
        return ProyectoRealizado.objects.filter(is_published=True)
    
    def get_serializer_class(self):
        if self.action == 'list':
            return ProyectoRealizadoListSerializer
        return ProyectoRealizadoSerializer
    
    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)
    
    @action(detail=True, methods=['post'], url_path='like')
    def add_like(self, request, pk=None):
        proyecto = self.get_object()
        proyecto.add_like()
        return Response({'likes': proyecto.likes})
    
    @action(detail=True, methods=['post'], url_path='view')
    def add_view(self, request, pk=None):
        proyecto = self.get_object()
        proyecto.add_view()
        return Response({'views': proyecto.views})


@extend_schema_view(
    list=extend_schema(tags=["Proyectos - Galería Antes/Después"]),
    create=extend_schema(tags=["Proyectos - Galería Antes/Después"]),
    destroy=extend_schema(tags=["Proyectos - Galería Antes/Después"]),
)
class ImagenAntesDespuesViewSet(viewsets.ModelViewSet):
    serializer_class = ImagenAntesDespuesSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    
    def get_queryset(self):
        proyecto_id = self.kwargs.get('proyecto_pk')
        if proyecto_id:
            return ImagenAntesDespues.objects.filter(proyecto_id=proyecto_id)
        return ImagenAntesDespues.objects.none()
    
    def perform_create(self, serializer):
        proyecto_id = self.kwargs.get('proyecto_pk')
        proyecto = get_object_or_404(ProyectoRealizado, id=proyecto_id)
        serializer.save(proyecto=proyecto)


@extend_schema_view(
    list=extend_schema(
        summary="Listar proyectos en progreso",
        description="Lista todos los proyectos en progreso publicados",
        tags=["Proyectos - En Progreso"]
    ),
    create=extend_schema(
        summary="Crear proyecto en progreso",
        tags=["Proyectos - En Progreso"]
    ),
    retrieve=extend_schema(
        summary="Obtener proyecto en progreso",
        tags=["Proyectos - En Progreso"]
    ),
    update=extend_schema(
        summary="Actualizar proyecto en progreso",
        tags=["Proyectos - En Progreso"]
    ),
    partial_update=extend_schema(
        summary="Actualizar parcial",
        tags=["Proyectos - En Progreso"]
    ),
    destroy=extend_schema(
        summary="Eliminar proyecto en progreso",
        tags=["Proyectos - En Progreso"]
    ),
)
class ProyectoEnProgresoViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['categoria', 'estado', 'urgencia', 'is_published']
    search_fields = ['title', 'description', 'location', 'necesidades']
    ordering_fields = ['start_date', 'avance_porcentaje', 'urgencia', 'views', 'likes']
    
    def get_queryset(self):
        if self.request.user.is_staff:
            return ProyectoEnProgreso.objects.all()
        return ProyectoEnProgreso.objects.filter(is_published=True)
    
    def get_serializer_class(self):
        if self.action == 'list':
            return ProyectoEnProgresoListSerializer
        return ProyectoEnProgresoSerializer
    
    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)
    
    @action(detail=True, methods=['post'], url_path='donate')
    def add_donation(self, request, pk=None):
        """Registrar una donación para el proyecto"""
        proyecto = self.get_object()
        amount = request.data.get('amount', 0)
        
        try:
            amount = float(amount)
            if amount <= 0:
                return Response(
                    {'error': 'El monto debe ser mayor a 0'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            proyecto.add_donation(amount)
            return Response({
                'message': 'Donación registrada',
                'recaudado': proyecto.recaudado,
                'porcentaje': proyecto.porcentaje_recaudado
            })
        except ValueError:
            return Response(
                {'error': 'Monto inválido'},
                status=status.HTTP_400_BAD_REQUEST
            )
    
    @action(detail=True, methods=['post'], url_path='volunteer')
    def add_volunteer(self, request, pk=None):
        """Registrar un voluntario para el proyecto"""
        proyecto = self.get_object()
        if proyecto.voluntarios_actuales < proyecto.voluntarios_necesarios:
            proyecto.add_volunteer()
            return Response({
                'message': 'Voluntario registrado',
                'voluntarios_actuales': proyecto.voluntarios_actuales,
                'voluntarios_faltantes': proyecto.voluntarios_necesarios - proyecto.voluntarios_actuales
            })
        return Response(
            {'error': 'Ya no se necesitan más voluntarios'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    @action(detail=True, methods=['post'], url_path='like')
    def add_like(self, request, pk=None):
        proyecto = self.get_object()
        proyecto.add_like()
        return Response({'likes': proyecto.likes})
    
    @action(detail=True, methods=['post'], url_path='view')
    def add_view(self, request, pk=None):
        proyecto = self.get_object()
        proyecto.add_view()
        return Response({'views': proyecto.views})
    
    @action(detail=True, methods=['get'], url_path='necesidades')
    def get_necesidades(self, request, pk=None):
        """Obtener necesidades específicas del proyecto"""
        proyecto = self.get_object()
        necesidades = proyecto.necesidades_especificas.all()
        serializer = NecesidadEspecificaSerializer(necesidades, many=True)
        return Response(serializer.data)


@extend_schema_view(
    list=extend_schema(tags=["Proyectos - Necesidades"]),
    create=extend_schema(tags=["Proyectos - Necesidades"]),
    destroy=extend_schema(tags=["Proyectos - Necesidades"]),
)
class NecesidadEspecificaViewSet(viewsets.ModelViewSet):
    serializer_class = NecesidadEspecificaSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    
    def get_queryset(self):
        proyecto_id = self.kwargs.get('proyecto_pk')
        if proyecto_id:
            return NecesidadEspecifica.objects.filter(proyecto_id=proyecto_id)
        return NecesidadEspecifica.objects.none()
    
    def perform_create(self, serializer):
        proyecto_id = self.kwargs.get('proyecto_pk')
        proyecto = get_object_or_404(ProyectoEnProgreso, id=proyecto_id)
        serializer.save(proyecto=proyecto)
    
    @action(detail=True, methods=['post'], url_path='cover')
    def cover_need(self, request, proyecto_pk=None, pk=None):
        """Marcar una necesidad como cubierta parcialmente"""
        necesidad = self.get_object()
        cantidad = request.data.get('cantidad', 1)
        
        try:
            cantidad = int(cantidad)
            if necesidad.cantidad_cubierta + cantidad <= necesidad.cantidad_necesaria:
                necesidad.cantidad_cubierta += cantidad
                necesidad.save()
                return Response({
                    'message': 'Necesidad actualizada',
                    'cantidad_cubierta': necesidad.cantidad_cubierta,
                    'cantidad_restante': necesidad.cantidad_necesaria - necesidad.cantidad_cubierta
                })
            return Response(
                {'error': 'La cantidad excede la necesidad'},
                status=status.HTTP_400_BAD_REQUEST
            )
        except ValueError:
            return Response(
                {'error': 'Cantidad inválida'},
                status=status.HTTP_400_BAD_REQUEST
            )


@extend_schema_view(
    list=extend_schema(tags=["Proyectos - Actualizaciones"]),
    create=extend_schema(tags=["Proyectos - Actualizaciones"]),
    destroy=extend_schema(tags=["Proyectos - Actualizaciones"]),
)
class ActualizacionProyectoViewSet(viewsets.ModelViewSet):
    serializer_class = ActualizacionProyectoSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    
    def get_queryset(self):
        proyecto_id = self.kwargs.get('proyecto_pk')
        if proyecto_id:
            return ActualizacionProyecto.objects.filter(proyecto_id=proyecto_id)
        return ActualizacionProyecto.objects.none()
    
    def perform_create(self, serializer):
        proyecto_id = self.kwargs.get('proyecto_pk')
        proyecto = get_object_or_404(ProyectoEnProgreso, id=proyecto_id)
        serializer.save(proyecto=proyecto, created_by=self.request.user)