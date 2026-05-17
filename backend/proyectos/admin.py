# proyectos/admin.py
from django.contrib import admin
from django.utils.html import format_html
from django.utils.translation import gettext_lazy as _
from .models import (
    CategoriaProyecto, ProyectoRealizado, ImagenAntesDespues,
    GaleriaProyectoRealizado, ProyectoEnProgreso, NecesidadEspecifica,
    GaleriaProyectoProgreso, ActualizacionProyecto
)


@admin.register(CategoriaProyecto)
class CategoriaProyectoAdmin(admin.ModelAdmin):
    list_display = ['name', 'slug', 'order', 'is_active']
    list_editable = ['order', 'is_active']
    list_filter = ['is_active']
    search_fields = ['name', 'description']
    prepopulated_fields = {'slug': ['name']}
    fieldsets = (
        ('Información básica', {
            'fields': ('name', 'slug', 'description')
        }),
        ('Personalización', {
            'fields': ('icon', 'order', 'is_active')
        }),
    )


class ImagenAntesDespuesInline(admin.TabularInline):
    model = ImagenAntesDespues
    extra = 1
    fields = ['title', 'image_before_preview', 'image_before', 'image_after_preview', 'image_after', 'order', 'is_featured']
    readonly_fields = ['image_before_preview', 'image_after_preview']
    classes = ['collapse']
    
    def image_before_preview(self, obj):
        if obj.image_before:
            return format_html('<img src="{}" width="80" height="60" style="object-fit:cover; border-radius:4px"/>', obj.image_before.url)
        return "Sin imagen"
    image_before_preview.short_description = "Vista previa ANTES"
    
    def image_after_preview(self, obj):
        if obj.image_after:
            return format_html('<img src="{}" width="80" height="60" style="object-fit:cover; border-radius:4px"/>', obj.image_after.url)
        return "Sin imagen"
    image_after_preview.short_description = "Vista previa DESPUÉS"


class GaleriaProyectoRealizadoInline(admin.TabularInline):
    model = GaleriaProyectoRealizado
    extra = 1
    fields = ['image_preview', 'image', 'title', 'order']
    readonly_fields = ['image_preview']
    classes = ['collapse']
    
    def image_preview(self, obj):
        if obj.image:
            return format_html('<img src="{}" width="80" height="60" style="object-fit:cover; border-radius:4px"/>', obj.image.url)
        return "Sin imagen"
    image_preview.short_description = "Vista previa"


@admin.register(ProyectoRealizado)
class ProyectoRealizadoAdmin(admin.ModelAdmin):
    list_display = ['title', 'location', 'start_date', 'end_date', 'beneficiarios', 'impacto_nivel', 'is_published', 'cover_image_preview']
    list_filter = ['is_published', 'impacto_nivel', 'categoria', 'start_date']
    search_fields = ['title', 'description', 'location']
    prepopulated_fields = {'slug': ['title']}
    readonly_fields = ['views', 'likes', 'created_at', 'updated_at', 'cover_image_preview']
    inlines = [ImagenAntesDespuesInline, GaleriaProyectoRealizadoInline]
    date_hierarchy = 'start_date'
    
    fieldsets = (
        ('Información básica', {
            'fields': ('title', 'slug', 'description', 'categoria')
        }),
        ('Fechas y ubicación', {
            'fields': ('start_date', 'end_date', 'location', 'latitude', 'longitude')
        }),
        ('Impacto del proyecto', {
            'fields': ('impacto_nivel', 'beneficiarios', 'inversion_total'),
            'description': 'Métricas de impacto del proyecto'
        }),
        ('Multimedia', {
            'fields': ('cover_image', 'cover_image_preview', 'video_url'),
            'description': 'Imagen principal y video destacado'
        }),
        ('Publicación', {
            'fields': ('is_published', 'published_at')
        }),
        ('Estadísticas', {
            'fields': ('views', 'likes'),
            'classes': ('collapse',)
        }),
        ('Auditoría', {
            'fields': ('created_by', 'created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    def cover_image_preview(self, obj):
        if obj.cover_image:
            return format_html('<img src="{}" width="100" height="70" style="object-fit:cover; border-radius:4px"/>', obj.cover_image.url)
        return "Sin imagen"
    cover_image_preview.short_description = "Vista previa de portada"
    
    actions = ['publish_projects', 'unpublish_projects']
    
    def publish_projects(self, request, queryset):
        from django.utils import timezone
        updated = queryset.update(is_published=True, published_at=timezone.now())
        self.message_user(request, f"{updated} proyectos publicados exitosamente.")
    publish_projects.short_description = "Publicar proyectos seleccionados"
    
    def unpublish_projects(self, request, queryset):
        updated = queryset.update(is_published=False)
        self.message_user(request, f"{updated} proyectos despublicados.")
    unpublish_projects.short_description = "Despublicar proyectos seleccionados"


class NecesidadEspecificaInline(admin.TabularInline):
    model = NecesidadEspecifica
    extra = 1
    fields = ['tipo', 'descripcion', 'cantidad_necesaria', 'cantidad_cubierta', 'porcentaje_cubierto', 'es_urgente', 'order']
    readonly_fields = ['porcentaje_cubierto']
    classes = ['collapse']
    
    def porcentaje_cubierto(self, obj):
        if obj.pk and obj.cantidad_necesaria > 0:
            porcentaje = (obj.cantidad_cubierta / obj.cantidad_necesaria) * 100
            return format_html('<span style="color: {};">{:.1f}%</span>', 
                              'green' if porcentaje >= 80 else 'orange' if porcentaje >= 50 else 'red',
                              porcentaje)
        return "0%"
    porcentaje_cubierto.short_description = "% Cubierto"


class GaleriaProyectoProgresoInline(admin.TabularInline):
    model = GaleriaProyectoProgreso
    extra = 1
    fields = ['image_preview', 'image', 'title', 'order']
    readonly_fields = ['image_preview']
    classes = ['collapse']
    
    def image_preview(self, obj):
        if obj.image:
            return format_html('<img src="{}" width="80" height="60" style="object-fit:cover; border-radius:4px"/>', obj.image.url)
        return "Sin imagen"
    image_preview.short_description = "Vista previa"


class ActualizacionProyectoInline(admin.TabularInline):
    model = ActualizacionProyecto
    extra = 1
    fields = ['title', 'content_preview', 'image_preview', 'image', 'published_at']
    readonly_fields = ['content_preview', 'image_preview']
    classes = ['collapse']
    
    def content_preview(self, obj):
        if obj.content:
            return obj.content[:100] + '...' if len(obj.content) > 100 else obj.content
        return ""
    content_preview.short_description = "Vista previa"
    
    def image_preview(self, obj):
        if obj.image:
            return format_html('<img src="{}" width="60" height="50" style="object-fit:cover; border-radius:4px"/>', obj.image.url)
        return "Sin imagen"
    image_preview.short_description = "Imagen"


@admin.register(ProyectoEnProgreso)
class ProyectoEnProgresoAdmin(admin.ModelAdmin):
    list_display = ['title', 'location', 'estado', 'urgencia', 'avance_porcentaje', 'porcentaje_recaudado_display', 'voluntarios_ratio', 'is_published', 'cover_image_preview']
    list_filter = ['estado', 'urgencia', 'is_published', 'categoria', 'start_date']
    search_fields = ['title', 'description', 'location', 'necesidades']
    prepopulated_fields = {'slug': ['title']}
    readonly_fields = ['views', 'likes', 'created_at', 'updated_at', 'recaudado', 'cover_image_preview']
    inlines = [NecesidadEspecificaInline, GaleriaProyectoProgresoInline, ActualizacionProyectoInline]
    date_hierarchy = 'start_date'
    
    fieldsets = (
        ('Información básica', {
            'fields': ('title', 'slug', 'description', 'categoria')
        }),
        ('Estado y urgencia', {
            'fields': ('estado', 'urgencia')
        }),
        ('Fechas y ubicación', {
            'fields': ('start_date', 'estimated_end_date', 'location', 'latitude', 'longitude')
        }),
        ('Donaciones y financiamiento', {
            'fields': ('meta_donacion', 'recaudado', 'porcentaje_recaudado_display', 'donacion_destacada_monto', 'donacion_destacada_nombre'),
            'description': 'Meta económica y donaciones destacadas'
        }),
        ('Necesidades del proyecto', {
            'fields': ('necesidades', 'voluntarios_necesarios', 'voluntarios_actuales')
        }),
        ('Avance del proyecto', {
            'fields': ('avance_porcentaje',)
        }),
        ('Multimedia', {
            'fields': ('cover_image', 'cover_image_preview', 'video_url')
        }),
        ('Publicación', {
            'fields': ('is_published', 'published_at')
        }),
        ('Estadísticas', {
            'fields': ('views', 'likes'),
            'classes': ('collapse',)
        }),
        ('Auditoría', {
            'fields': ('created_by', 'created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    def cover_image_preview(self, obj):
        if obj.cover_image:
            return format_html('<img src="{}" width="100" height="70" style="object-fit:cover; border-radius:4px"/>', obj.cover_image.url)
        return "Sin imagen"
    cover_image_preview.short_description = "Vista previa de portada"
    
    def porcentaje_recaudado_display(self, obj):
        porcentaje = obj.porcentaje_recaudado
        color = 'green' if porcentaje >= 70 else 'orange' if porcentaje >= 30 else 'red'
        return format_html('<span style="color: {}; font-weight: bold;">{:.1f}%</span>', color, porcentaje)
    porcentaje_recaudado_display.short_description = "% Recaudado"
    
    def voluntarios_ratio(self, obj):
        if obj.voluntarios_necesarios > 0:
            porcentaje = (obj.voluntarios_actuales / obj.voluntarios_necesarios) * 100
            return format_html('<span style="color: {};">{:.1f}% ({}/{})</span>', 
                              'green' if porcentaje >= 80 else 'orange', 
                              porcentaje,
                              obj.voluntarios_actuales,
                              obj.voluntarios_necesarios)
        return "N/A"
    voluntarios_ratio.short_description = "Voluntarios"
    
    actions = ['publish_projects', 'unpublish_projects', 'reset_donation_counter']
    
    def publish_projects(self, request, queryset):
        from django.utils import timezone
        updated = queryset.update(is_published=True, published_at=timezone.now())
        self.message_user(request, f"{updated} proyectos publicados exitosamente.")
    publish_projects.short_description = "Publicar proyectos seleccionados"
    
    def unpublish_projects(self, request, queryset):
        updated = queryset.update(is_published=False)
        self.message_user(request, f"{updated} proyectos despublicados.")
    unpublish_projects.short_description = "Despublicar proyectos seleccionados"
    
    def reset_donation_counter(self, request, queryset):
        updated = queryset.update(recaudado=0)
        self.message_user(request, f"{updated} proyectos reiniciaron su contador de donaciones.")
    reset_donation_counter.short_description = "Reiniciar contador de donaciones"


@admin.register(ImagenAntesDespues)
class ImagenAntesDespuesAdmin(admin.ModelAdmin):
    list_display = ['id', 'proyecto', 'title', 'order', 'is_featured', 'image_before_preview', 'image_after_preview']
    list_filter = ['is_featured', 'proyecto']
    search_fields = ['title', 'description', 'proyecto__title']
    list_editable = ['order', 'is_featured']
    readonly_fields = ['image_before_preview', 'image_after_preview']
    
    def image_before_preview(self, obj):
        if obj.image_before:
            return format_html('<img src="{}" width="100" height="70" style="object-fit:cover; border-radius:4px"/>', obj.image_before.url)
        return "Sin imagen"
    image_before_preview.short_description = "Imagen ANTES"
    
    def image_after_preview(self, obj):
        if obj.image_after:
            return format_html('<img src="{}" width="100" height="70" style="object-fit:cover; border-radius:4px"/>', obj.image_after.url)
        return "Sin imagen"
    image_after_preview.short_description = "Imagen DESPUÉS"


@admin.register(GaleriaProyectoRealizado)
class GaleriaProyectoRealizadoAdmin(admin.ModelAdmin):
    list_display = ['id', 'proyecto', 'title', 'order', 'image_preview']
    list_filter = ['proyecto']
    search_fields = ['title', 'description', 'proyecto__title']
    list_editable = ['order']
    readonly_fields = ['image_preview']
    
    def image_preview(self, obj):
        if obj.image:
            return format_html('<img src="{}" width="80" height="60" style="object-fit:cover; border-radius:4px"/>', obj.image.url)
        return "Sin imagen"
    image_preview.short_description = "Vista previa"


@admin.register(NecesidadEspecifica)
class NecesidadEspecificaAdmin(admin.ModelAdmin):
    list_display = ['id', 'proyecto', 'tipo', 'descripcion_corta', 'cantidad_necesaria', 'cantidad_cubierta', 'porcentaje_cubierto', 'es_urgente']
    list_filter = ['tipo', 'es_urgente', 'proyecto']
    search_fields = ['descripcion', 'proyecto__title']
    list_editable = ['es_urgente']
    readonly_fields = ['porcentaje_cubierto']
    
    def descripcion_corta(self, obj):
        return obj.descripcion[:50] + '...' if len(obj.descripcion) > 50 else obj.descripcion
    descripcion_corta.short_description = "Descripción"
    
    def porcentaje_cubierto(self, obj):
        if obj.cantidad_necesaria > 0:
            return f"{(obj.cantidad_cubierta / obj.cantidad_necesaria) * 100:.1f}%"
        return "0%"
    porcentaje_cubierto.short_description = "% Cubierto"


@admin.register(GaleriaProyectoProgreso)
class GaleriaProyectoProgresoAdmin(admin.ModelAdmin):
    list_display = ['id', 'proyecto', 'title', 'order', 'image_preview']
    list_filter = ['proyecto']
    search_fields = ['title', 'description', 'proyecto__title']
    list_editable = ['order']
    readonly_fields = ['image_preview']
    
    def image_preview(self, obj):
        if obj.image:
            return format_html('<img src="{}" width="80" height="60" style="object-fit:cover; border-radius:4px"/>', obj.image.url)
        return "Sin imagen"
    image_preview.short_description = "Vista previa"


@admin.register(ActualizacionProyecto)
class ActualizacionProyectoAdmin(admin.ModelAdmin):
    list_display = ['id', 'proyecto', 'title', 'published_at', 'created_by']
    list_filter = ['proyecto', 'published_at']
    search_fields = ['title', 'content', 'proyecto__title']
    date_hierarchy = 'published_at'
    readonly_fields = ['created_by', 'published_at']
    
    fieldsets = (
        ('Información', {
            'fields': ('proyecto', 'title', 'content')
        }),
        ('Multimedia', {
            'fields': ('image',)
        }),
        ('Publicación', {
            'fields': ('published_at', 'created_by')
        }),
    )
    
    def save_model(self, request, obj, form, change):
        if not change:
            obj.created_by = request.user
        super().save_model(request, obj, form, change)