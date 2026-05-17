# testimonios/serializers.py - Versión CORREGIDA
from rest_framework import serializers
from .models import Testimonio, TestimonioReporte, TestimonioComentario


class TestimonioListSerializer(serializers.ModelSerializer):
    """Serializer para listado de testimonios (campos básicos)"""
    author_type_display = serializers.ReadOnlyField(source='get_author_type_display')
    status_display = serializers.ReadOnlyField(source='get_status_display')
    author_photo_url = serializers.SerializerMethodField()
    content_preview = serializers.SerializerMethodField()
    
    class Meta:
        model = Testimonio
        fields = [
            'id', 'author_name', 'author_type', 'author_type_display',
            'title', 'content_preview', 'rating', 'status', 'status_display',
            'author_photo_url', 'video_url', 'likes', 'views', 'published_at',
            'featured_order'
        ]
    
    def get_author_photo_url(self, obj):
        if obj.author_photo and hasattr(obj.author_photo, 'url'):
            return obj.author_photo.url
        return None
    
    def get_content_preview(self, obj):
        return obj.content[:150] + '...' if len(obj.content) > 150 else obj.content


class TestimonioDetailSerializer(serializers.ModelSerializer):
    """Serializer para detalle de testimonio (campos completos)"""
    author_type_display = serializers.ReadOnlyField(source='get_author_type_display')
    status_display = serializers.ReadOnlyField(source='get_status_display')
    author_photo_url = serializers.SerializerMethodField()
    moderated_by_name = serializers.ReadOnlyField(source='moderated_by.email', default=None)
    created_by_name = serializers.ReadOnlyField(source='created_by.email', default=None)
    
    class Meta:
        model = Testimonio
        fields = '__all__'
    
    def get_author_photo_url(self, obj):
        if obj.author_photo and hasattr(obj.author_photo, 'url'):
            return obj.author_photo.url
        return None


class TestimonioCreateSerializer(serializers.ModelSerializer):
    """Serializer para creación de testimonios (público)"""
    
    class Meta:
        model = Testimonio
        fields = [
            'author_name', 'author_email', 'author_type', 'title',
            'content', 'author_photo', 'video_url', 'rating', 'proyecto_nombre'
        ]
    
    def validate_author_email(self, value):
        """Validar formato de email"""
        from django.core.validators import EmailValidator
        validator = EmailValidator()
        validator(value)
        return value
    
    def create(self, validated_data):
        # Los testimonios creados por usuarios públicos quedan pendientes
        validated_data['status'] = Testimonio.Status.PENDING
        return super().create(validated_data)


class TestimonioUpdateSerializer(serializers.ModelSerializer):
    """Serializer para actualización de testimonios (admin/moderador)"""
    
    class Meta:
        model = Testimonio
        fields = [
            'author_name', 'author_type', 'title', 'content',
            'author_photo', 'video_url', 'rating', 'status',
            'featured_order', 'featured_until', 'show_author_name',
            'show_author_photo', 'allow_comments', 'proyecto_nombre'
        ]


class TestimonioModerateSerializer(serializers.Serializer):
    """Serializer para moderación de testimonios"""
    action = serializers.ChoiceField(choices=['approve', 'reject', 'feature'])
    rejection_reason = serializers.CharField(required=False, allow_blank=True)
    
    def validate(self, data):
        if data['action'] == 'reject' and not data.get('rejection_reason'):
            raise serializers.ValidationError(
                {"rejection_reason": "Debe proporcionar un motivo para el rechazo"}
            )
        return data


class TestimonioReporteSerializer(serializers.ModelSerializer):
    """Serializer para reportar testimonios"""
    testimonio_id = serializers.PrimaryKeyRelatedField(
        queryset=Testimonio.objects.all(),
        source='testimonio'
    )
    
    class Meta:
        model = TestimonioReporte
        fields = ['testimonio_id', 'reason', 'description']
    
    def create(self, validated_data):
        validated_data['reported_by'] = self.context['request'].user
        return super().create(validated_data)


class TestimonioComentarioSerializer(serializers.ModelSerializer):
    """Serializer para comentarios en testimonios"""
    user_name = serializers.ReadOnlyField(source='user.email')
    created_at_display = serializers.SerializerMethodField()
    
    class Meta:
        model = TestimonioComentario
        fields = ['id', 'user', 'user_name', 'content', 'likes', 'created_at', 'created_at_display']
        read_only_fields = ['user', 'likes', 'created_at']
    
    def get_created_at_display(self, obj):
        from django.utils.timesince import timesince
        return timesince(obj.created_at) + " ago"
    
    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)