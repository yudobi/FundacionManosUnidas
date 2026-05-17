# proyectos/serializers.py - VERSIÓN CORREGIDA
from rest_framework import serializers
from .models import (
    CategoriaProyecto, ProyectoRealizado, ImagenAntesDespues,
    GaleriaProyectoRealizado, ProyectoEnProgreso, NecesidadEspecifica,
    GaleriaProyectoProgreso, ActualizacionProyecto
)


class CategoriaProyectoSerializer(serializers.ModelSerializer):
    class Meta:
        model = CategoriaProyecto
        fields = '__all__'


# ==================== PROYECTOS REALIZADOS ====================

class ImagenAntesDespuesSerializer(serializers.ModelSerializer):
    image_before_url = serializers.SerializerMethodField()
    image_after_url = serializers.SerializerMethodField()
    
    class Meta:
        model = ImagenAntesDespues
        fields = '__all__'
    
    def get_image_before_url(self, obj):
        if obj.image_before:
            return obj.image_before.url
        return None
    
    def get_image_after_url(self, obj):
        if obj.image_after:
            return obj.image_after.url
        return None


class GaleriaProyectoRealizadoSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()
    
    class Meta:
        model = GaleriaProyectoRealizado
        fields = '__all__'
    
    def get_image_url(self, obj):
        if obj.image:
            return obj.image.url
        return None


class ProyectoRealizadoListSerializer(serializers.ModelSerializer):
    """Serializer para listado (campos básicos)"""
    categoria_nombre = serializers.ReadOnlyField(source='categoria.name', default=None)
    cover_image_url = serializers.SerializerMethodField()
    description_short = serializers.SerializerMethodField()  # ← Agregamos este método
    
    class Meta:
        model = ProyectoRealizado
        fields = [
            'id', 'title', 'slug', 'description_short', 'start_date', 'end_date',
            'location', 'impacto_nivel', 'beneficiarios', 'cover_image_url',
            'categoria_nombre', 'views', 'likes'
        ]
    
    def get_cover_image_url(self, obj):
        if obj.cover_image:
            return obj.cover_image.url
        return None
    
    def get_description_short(self, obj):
        """Retorna una versión corta de la descripción"""
        if len(obj.description) > 150:
            return obj.description[:150] + '...'
        return obj.description


class ProyectoRealizadoSerializer(serializers.ModelSerializer):
    imagenes_antes_despues = ImagenAntesDespuesSerializer(many=True, read_only=True)
    galeria = GaleriaProyectoRealizadoSerializer(many=True, read_only=True)
    categoria_nombre = serializers.ReadOnlyField(source='categoria.name', default=None)
    cover_image_url = serializers.SerializerMethodField()
    impacto_nivel_display = serializers.ReadOnlyField(source='get_impacto_nivel_display')
    
    class Meta:
        model = ProyectoRealizado
        fields = '__all__'
    
    def get_cover_image_url(self, obj):
        if obj.cover_image:
            return obj.cover_image.url
        return None


# ==================== PROYECTOS EN PROGRESO ====================

class NecesidadEspecificaSerializer(serializers.ModelSerializer):
    tipo_display = serializers.ReadOnlyField(source='get_tipo_display')
    porcentaje_cubierto = serializers.SerializerMethodField()
    
    class Meta:
        model = NecesidadEspecifica
        fields = '__all__'
    
    def get_porcentaje_cubierto(self, obj):
        if obj.cantidad_necesaria > 0:
            return (obj.cantidad_cubierta / obj.cantidad_necesaria) * 100
        return 0


class GaleriaProyectoProgresoSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()
    
    class Meta:
        model = GaleriaProyectoProgreso
        fields = '__all__'
    
    def get_image_url(self, obj):
        if obj.image:
            return obj.image.url
        return None


class ActualizacionProyectoSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()
    created_by_name = serializers.ReadOnlyField(source='created_by.email', default=None)
    
    class Meta:
        model = ActualizacionProyecto
        fields = '__all__'
    
    def get_image_url(self, obj):
        if obj.image:
            return obj.image.url
        return None


class ProyectoEnProgresoListSerializer(serializers.ModelSerializer):
    """Serializer para listado (campos básicos)"""
    categoria_nombre = serializers.ReadOnlyField(source='categoria.name', default=None)
    cover_image_url = serializers.SerializerMethodField()
    porcentaje_recaudado = serializers.SerializerMethodField()
    estado_display = serializers.ReadOnlyField(source='get_estado_display')
    description_short = serializers.SerializerMethodField()  # ← Agregamos este método
    
    class Meta:
        model = ProyectoEnProgreso
        fields = [
            'id', 'title', 'slug', 'description_short', 'estado', 'estado_display',
            'urgencia', 'start_date', 'location', 'meta_donacion', 'recaudado',
            'porcentaje_recaudado', 'voluntarios_necesarios', 'voluntarios_actuales',
            'cover_image_url', 'categoria_nombre', 'avance_porcentaje', 'views', 'likes'
        ]
    
    def get_cover_image_url(self, obj):
        if obj.cover_image:
            return obj.cover_image.url
        return None
    
    def get_porcentaje_recaudado(self, obj):
        return obj.porcentaje_recaudado
    
    def get_description_short(self, obj):
        """Retorna una versión corta de la descripción"""
        if len(obj.description) > 150:
            return obj.description[:150] + '...'
        return obj.description


class ProyectoEnProgresoSerializer(serializers.ModelSerializer):
    necesidades_especificas = NecesidadEspecificaSerializer(many=True, read_only=True)
    galeria = GaleriaProyectoProgresoSerializer(many=True, read_only=True)
    actualizaciones = ActualizacionProyectoSerializer(many=True, read_only=True)
    categoria_nombre = serializers.ReadOnlyField(source='categoria.name', default=None)
    cover_image_url = serializers.SerializerMethodField()
    estado_display = serializers.ReadOnlyField(source='get_estado_display')
    urgencia_display = serializers.ReadOnlyField(source='get_urgencia_display')
    porcentaje_recaudado = serializers.SerializerMethodField()
    porcentaje_voluntarios = serializers.SerializerMethodField()
    
    class Meta:
        model = ProyectoEnProgreso
        fields = '__all__'
    
    def get_cover_image_url(self, obj):
        if obj.cover_image:
            return obj.cover_image.url
        return None
    
    def get_porcentaje_recaudado(self, obj):
        return obj.porcentaje_recaudado
    
    def get_porcentaje_voluntarios(self, obj):
        return obj.porcentaje_voluntarios