from django.contrib import admin

# Register your models here.
from django.contrib import admin
from django.utils.html import format_html
from .models import Testimonio, TestimonioReporte, TestimonioComentario


@admin.register(Testimonio)
class TestimonioAdmin(admin.ModelAdmin):
    list_display = [
        'id', 'author_name', 'author_type', 'status', 'rating',
        'likes', 'views', 'created_at', 'preview_content'
    ]
    list_filter = ['status', 'author_type', 'rating', 'created_at']
    search_fields = ['author_name', 'author_email', 'title', 'content']
    readonly_fields = ['likes', 'views', 'report_count', 'created_at', 'updated_at']
    list_editable = ['status', 'rating']
    
    fieldsets = (
        ('Información del autor', {
            'fields': ('author_name', 'author_email', 'author_type', 'author_photo')
        }),
        ('Contenido', {
            'fields': ('title', 'content', 'video_url', 'rating')
        }),
        ('Estado y moderación', {
            'fields': ('status', 'rejection_reason', 'moderation_notes', 
                      'moderated_by', 'moderated_at', 'featured_until', 'featured_order')
        }),
        ('Estadísticas', {
            'fields': ('likes', 'views', 'report_count'),
            'classes': ('collapse',)
        }),
        ('Configuración', {
            'fields': ('show_author_name', 'show_author_photo', 'allow_comments')
        }),
        ('Auditoría', {
            'fields': ('created_by', 'created_at', 'updated_at', 'published_at'),
            'classes': ('collapse',)
        }),
    )
    
    def preview_content(self, obj):
        return obj.content[:100] + '...' if len(obj.content) > 100 else obj.content
    preview_content.short_description = "Vista previa"
    
    actions = ['approve_testimonios', 'reject_testimonios', 'feature_testimonios']
    
    def approve_testimonios(self, request, queryset):
        for testimonio in queryset:
            testimonio.approve(request.user)
        self.message_user(request, f"{queryset.count()} testimonios aprobados")
    approve_testimonios.short_description = "Aprobar testimonios seleccionados"
    
    def reject_testimonios(self, request, queryset):
        for testimonio in queryset:
            testimonio.reject(request.user, "Rechazado por administrador")
        self.message_user(request, f"{queryset.count()} testimonios rechazados")
    reject_testimonios.short_description = "Rechazar testimonios seleccionados"
    
    def feature_testimonios(self, request, queryset):
        for testimonio in queryset:
            testimonio.feature()
        self.message_user(request, f"{queryset.count()} testimonios destacados")
    feature_testimonios.short_description = "Destacar testimonios seleccionados"


@admin.register(TestimonioReporte)
class TestimonioReporteAdmin(admin.ModelAdmin):
    list_display = ['id', 'testimonio', 'reported_by', 'reason', 'created_at', 'resolved']
    list_filter = ['reason', 'resolved', 'created_at']
    search_fields = ['testimonio__author_name', 'reported_by__email', 'description']


@admin.register(TestimonioComentario)
class TestimonioComentarioAdmin(admin.ModelAdmin):
    list_display = ['id', 'testimonio', 'user', 'content_preview', 'likes', 'created_at']
    list_filter = ['is_approved', 'created_at']
    search_fields = ['user__email', 'content']
    
    def content_preview(self, obj):
        return obj.content[:50] + '...' if len(obj.content) > 50 else obj.content
    content_preview.short_description = "Comentario"