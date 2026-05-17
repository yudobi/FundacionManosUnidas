from django.shortcuts import render

# Create your views here.
from rest_framework import viewsets, permissions, status, filters, serializers
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from django.shortcuts import get_object_or_404
from drf_spectacular.utils import extend_schema, extend_schema_view, OpenApiResponse
from .models import Testimonio, TestimonioReporte, TestimonioComentario
from .serializers import (
    TestimonioListSerializer, TestimonioDetailSerializer,
    TestimonioCreateSerializer, TestimonioUpdateSerializer,
    TestimonioModerateSerializer, TestimonioReporteSerializer,
    TestimonioComentarioSerializer
)


@extend_schema_view(
    list=extend_schema(
        summary="Listar testimonios",
        description="Lista todos los testimonios aprobados. Los moderadores ven todos.",
        tags=["Testimonios"]
    ),
    create=extend_schema(
        summary="Crear testimonio",
        description="Crea un nuevo testimonio (queda pendiente de moderación)",
        tags=["Testimonios"]
    ),
    retrieve=extend_schema(
        summary="Obtener testimonio",
        description="Obtiene los detalles de un testimonio específico",
        tags=["Testimonios"]
    ),
    update=extend_schema(
        summary="Actualizar testimonio",
        description="Actualiza completamente un testimonio (requiere permisos de moderador)",
        tags=["Testimonios"]
    ),
    partial_update=extend_schema(
        summary="Actualizar parcialmente",
        description="Actualiza parcialmente un testimonio (requiere permisos de moderador)",
        tags=["Testimonios"]
    ),
    destroy=extend_schema(
        summary="Eliminar testimonio",
        description="Elimina un testimonio (requiere permisos de moderador)",
        tags=["Testimonios"]
    ),
)
class TestimonioViewSet(viewsets.ModelViewSet):
    queryset = Testimonio.objects.all()
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['status', 'author_type', 'rating']
    search_fields = ['author_name', 'title', 'content']
    ordering_fields = ['created_at', 'published_at', 'likes', 'views', 'rating']
    ordering = ['-featured_order', '-published_at']
    
    def get_serializer_class(self):
        if self.action == 'create':
            return TestimonioCreateSerializer
        elif self.action in ['update', 'partial_update']:
            return TestimonioUpdateSerializer
        elif self.action == 'list':
            return TestimonioListSerializer
        else:
            return TestimonioDetailSerializer
    
    def get_queryset(self):
        user = self.request.user
        
        # Si es superusuario o moderador, ve todos
        if user.is_staff or user.has_perm('testimonios.can_moderate_testimonios'):
            return Testimonio.objects.all()
        
        # Usuarios normales: solo ven aprobados y destacados
        return Testimonio.objects.filter(status__in=[
            Testimonio.Status.APPROVED,
            Testimonio.Status.FEATURED
        ])
    
    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)
    
    @action(detail=False, methods=['get'], url_path='featured')
    def get_featured(self, request):
        """Obtener testimonios destacados"""
        from django.utils import timezone
        testimonios = Testimonio.objects.filter(
            status=Testimonio.Status.FEATURED,
            featured_until__gte=timezone.now()
        ).order_by('featured_order')
        serializer = TestimonioListSerializer(testimonios, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'], url_path='by-type/(?P<author_type>[^/.]+)')
    def by_type(self, request, author_type=None):
        """Filtrar testimonios por tipo de autor"""
        testimonios = self.get_queryset().filter(author_type=author_type)
        serializer = TestimonioListSerializer(testimonios, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'], url_path='like')
    def add_like(self, request, pk=None):
        """Dar like a un testimonio"""
        testimonio = self.get_object()
        testimonio.add_like()
        return Response({'likes': testimonio.likes})
    
    @action(detail=True, methods=['post'], url_path='view')
    def add_view(self, request, pk=None):
        """Registrar vista de testimonio"""
        testimonio = self.get_object()
        testimonio.add_view()
        return Response({'views': testimonio.views})
    
    @action(detail=True, methods=['post'], url_path='moderate')
    def moderate(self, request, pk=None):
        """Moderar testimonio (aprobar, rechazar, destacar)"""
        if not (request.user.is_staff or request.user.has_perm('testimonios.can_moderate_testimonios')):
            return Response(
                {'error': 'No tienes permisos para moderar testimonios'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        testimonio = self.get_object()
        serializer = TestimonioModerateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        action = serializer.validated_data['action']
        
        if action == 'approve':
            testimonio.approve(request.user)
            message = "Testimonio aprobado exitosamente"
        elif action == 'reject':
            reason = serializer.validated_data.get('rejection_reason', '')
            testimonio.reject(request.user, reason)
            message = "Testimonio rechazado"
        elif action == 'feature':
            testimonio.feature()
            message = "Testimonio destacado"
        
        return Response({'message': message, 'status': testimonio.status})
    
    @action(detail=True, methods=['post'], url_path='report')
    def report(self, request, pk=None):
        """Reportar testimonio inapropiado"""
        testimonio = self.get_object()
        
        # Verificar si ya reportó este testimonio
        if TestimonioReporte.objects.filter(
            testimonio=testimonio,
            reported_by=request.user
        ).exists():
            return Response(
                {'error': 'Ya has reportado este testimonio'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        serializer = TestimonioReporteSerializer(
            data=request.data,
            context={'request': request}
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()
        
        # Incrementar contador de reportes
        testimonio.report_count += 1
        testimonio.save(update_fields=['report_count'])
        
        return Response(
            {'message': 'Testimonio reportado exitosamente'},
            status=status.HTTP_201_CREATED
        )


@extend_schema_view(
    list=extend_schema(tags=["Testimonios Comentarios"]),
    create=extend_schema(tags=["Testimonios Comentarios"]),
    destroy=extend_schema(tags=["Testimonios Comentarios"]),
)
class TestimonioComentarioViewSet(viewsets.ModelViewSet):
    """CRUD de comentarios en testimonios"""
    serializer_class = TestimonioComentarioSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    
    def get_queryset(self):
        testimonio_id = self.kwargs.get('testimonio_pk')
        testimonio = get_object_or_404(Testimonio, id=testimonio_id)
        return testimonio.comentarios.filter(is_approved=True)
    
    def perform_create(self, serializer):
        testimonio_id = self.kwargs.get('testimonio_pk')
        testimonio = get_object_or_404(Testimonio, id=testimonio_id)
        
        # Verificar si el testimonio permite comentarios
        if not testimonio.allow_comments:
            raise serializers.ValidationError("Este testimonio no permite comentarios")
        
        serializer.save(testimonio=testimonio)
    
    @action(detail=True, methods=['post'], url_path='like')
    def add_like(self, request, testimonio_pk=None, pk=None):
        """Dar like a un comentario"""
        comentario = self.get_object()
        comentario.likes += 1
        comentario.save(update_fields=['likes'])
        return Response({'likes': comentario.likes})