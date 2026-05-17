# testimonios/models.py - Versión CORREGIDA (sin dependencia de proyectos)

from django.db import models
from django.utils import timezone
from django.core.validators import MinLengthValidator, MaxLengthValidator
from django.conf import settings


class Testimonio(models.Model):
    """
    Modelo para gestionar testimonios de participantes, donantes, voluntarios, etc.
    """
    
    # Estados del testimonio
    class Status(models.TextChoices):
        PENDING = 'PENDING', 'Pendiente de revisión'
        APPROVED = 'APPROVED', 'Aprobado'
        REJECTED = 'REJECTED', 'Rechazado'
        FEATURED = 'FEATURED', 'Destacado'
    
    # Tipo de autor
    class AuthorType(models.TextChoices):
        DONANTE = 'DONANTE', 'Donante'
        VOLUNTARIO = 'VOLUNTARIO', 'Voluntario'
        BENEFICIARIO = 'BENEFICIARIO', 'Beneficiario'
        ALIADO = 'ALIADO', 'Aliado estratégico'
        PARTICIPANTE = 'PARTICIPANTE', 'Participante'
    
    # Información básica
    author_name = models.CharField(
        max_length=100, 
        verbose_name="Nombre del autor",
        help_text="Nombre de la persona que da el testimonio"
    )
    author_email = models.EmailField(
        verbose_name="Email del autor",
        help_text="Para contacto interno, no se muestra públicamente"
    )
    author_type = models.CharField(
        max_length=20, 
        choices=AuthorType.choices, 
        default=AuthorType.PARTICIPANTE,
        verbose_name="Tipo de autor"
    )
    
    # Contenido del testimonio
    title = models.CharField(
        max_length=200, 
        blank=True,
        verbose_name="Título",
        help_text="Opcional: título corto del testimonio"
    )
    content = models.TextField(
        validators=[MinLengthValidator(20), MaxLengthValidator(2000)],
        verbose_name="Contenido",
        help_text="Testimonio completo (mínimo 20 caracteres, máximo 2000)"
    )
    
    # Multimedia
    author_photo = models.ImageField(
        upload_to='testimonios/photos/%Y/%m/',
        blank=True,
        null=True,
        verbose_name="Foto del autor"
    )
    video_url = models.URLField(
        blank=True,
        verbose_name="Video testimonio (YouTube/Vimeo)",
        help_text="URL del video de testimonio"
    )
    
    # Proyecto relacionado (opcional) - COMENTADO HASTA QUE EXISTA LA APP PROYECTOS
    # proyecto_relacionado = models.ForeignKey(
    #     'proyectos.ProyectoRealizado',
    #     on_delete=models.SET_NULL,
    #     null=True,
    #     blank=True,
    #     verbose_name="Proyecto relacionado",
    #     help_text="Proyecto con el que está relacionado el testimonio"
    # )
    
    # Campo alternativo mientras no existe la app proyectos
    proyecto_nombre = models.CharField(
        max_length=200,
        blank=True,
        null=True,
        verbose_name="Proyecto relacionado",
        help_text="Nombre del proyecto relacionado (temporal)"
    )
    
    # Calificación (opcional)
    rating = models.PositiveSmallIntegerField(
        choices=[(i, f"{i} estrellas") for i in range(1, 6)],
        null=True,
        blank=True,
        verbose_name="Calificación",
        help_text="Calificación de 1 a 5 estrellas"
    )
    
    # Campos de estado y moderación
    status = models.CharField(
        max_length=20, 
        choices=Status.choices, 
        default=Status.PENDING,
        verbose_name="Estado"
    )
    rejection_reason = models.TextField(
        blank=True,
        verbose_name="Motivo de rechazo",
        help_text="Si es rechazado, indicar el motivo"
    )
    moderation_notes = models.TextField(
        blank=True,
        verbose_name="Notas de moderación",
        help_text="Notas internas del moderador"
    )
    moderated_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='moderated_testimonios',
        verbose_name="Moderado por"
    )
    moderated_at = models.DateTimeField(
        null=True,
        blank=True,
        verbose_name="Fecha de moderación"
    )
    
    # Campos para destacar testimonio
    featured_until = models.DateTimeField(
        null=True,
        blank=True,
        verbose_name="Destacado hasta",
        help_text="Fecha hasta la cual el testimonio aparecerá como destacado"
    )
    featured_order = models.PositiveIntegerField(
        default=0,
        verbose_name="Orden en destacados"
    )
    
    # Estadísticas
    likes = models.PositiveIntegerField(default=0, verbose_name="Me gusta")
    views = models.PositiveIntegerField(default=0, verbose_name="Vistas")
    report_count = models.PositiveIntegerField(
        default=0, 
        verbose_name="Reportes",
        help_text="Número de veces que ha sido reportado"
    )
    
    # Auditoría
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='created_testimonios',
        verbose_name="Creado por"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    published_at = models.DateTimeField(
        null=True,
        blank=True,
        verbose_name="Fecha de publicación"
    )
    
    # Configuración de visibilidad
    show_author_name = models.BooleanField(
        default=True,
        verbose_name="Mostrar nombre del autor"
    )
    show_author_photo = models.BooleanField(
        default=True,
        verbose_name="Mostrar foto del autor"
    )
    allow_comments = models.BooleanField(
        default=False,
        verbose_name="Permitir comentarios"
    )
    
    class Meta:
        db_table = 'testimonios'
        verbose_name = "Testimonio"
        verbose_name_plural = "Testimonios"
        ordering = ['-featured_order', '-published_at', '-created_at']
        indexes = [
            models.Index(fields=['status', '-published_at']),
            models.Index(fields=['author_type']),
            models.Index(fields=['status', 'featured_order']),
            models.Index(fields=['-created_at']),
        ]
        permissions = [
            ("can_moderate_testimonios", "Puede moderar testimonios"),
            ("can_feature_testimonios", "Puede destacar testimonios"),
        ]
    
    def __str__(self):
        return f"Testimonio de {self.author_name} - {self.get_status_display()}"
    
    def save(self, *args, **kwargs):
        # Si se aprueba por primera vez, establecer fecha de publicación
        if self.status == self.Status.APPROVED and not self.published_at:
            self.published_at = timezone.now()
        
        # Si se destaca, asegurar que la fecha de expiración sea futura
        if self.status == self.Status.FEATURED and not self.featured_until:
            self.featured_until = timezone.now() + timezone.timedelta(days=30)
        
        super().save(*args, **kwargs)
    
    def approve(self, moderator):
        """Aprobar testimonio"""
        self.status = self.Status.APPROVED
        self.moderated_by = moderator
        self.moderated_at = timezone.now()
        self.published_at = timezone.now()
        self.save()
    
    def reject(self, moderator, reason):
        """Rechazar testimonio con motivo"""
        self.status = self.Status.REJECTED
        self.moderated_by = moderator
        self.moderated_at = timezone.now()
        self.rejection_reason = reason
        self.save()
    
    def feature(self):
        """Destacar testimonio"""
        self.status = self.Status.FEATURED
        self.featured_until = timezone.now() + timezone.timedelta(days=30)
        self.save()
    
    def add_like(self):
        """Incrementar contador de likes"""
        self.likes += 1
        self.save(update_fields=['likes'])
    
    def add_view(self):
        """Incrementar contador de vistas"""
        self.views += 1
        self.save(update_fields=['views'])


class TestimonioReporte(models.Model):
    """
    Modelo para reportar testimonios inapropiados
    """
    
    class ReportReason(models.TextChoices):
        SPAM = 'SPAM', 'Spam'
        OFFENSIVE = 'OFFENSIVE', 'Contenido ofensivo'
        FALSE = 'FALSE', 'Información falsa'
        COPYRIGHT = 'COPYRIGHT', 'Infracción de derechos'
        OTHER = 'OTHER', 'Otro'
    
    testimonio = models.ForeignKey(
        Testimonio,
        on_delete=models.CASCADE,
        related_name='reports'
    )
    reported_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='reports'
    )
    reason = models.CharField(max_length=20, choices=ReportReason.choices)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    resolved = models.BooleanField(default=False)
    resolved_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='resolved_reports'
    )
    resolved_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        db_table = 'testimonios_reports'
        verbose_name = "Reporte de testimonio"
        verbose_name_plural = "Reportes de testimonios"
        unique_together = [['testimonio', 'reported_by']]
    
    def __str__(self):
        return f"Reporte de {self.reported_by.email} - {self.testimonio.author_name}"


class TestimonioComentario(models.Model):
    """
    Modelo para comentarios en testimonios (opcional)
    """
    
    testimonio = models.ForeignKey(
        Testimonio,
        on_delete=models.CASCADE,
        related_name='comentarios'
    )
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='testimonio_comentarios'
    )
    content = models.TextField(max_length=500)
    likes = models.PositiveIntegerField(default=0)
    is_approved = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'testimonios_comentarios'
        verbose_name = "Comentario de testimonio"
        verbose_name_plural = "Comentarios de testimonios"
        ordering = ['created_at']
    
    def __str__(self):
        return f"Comentario de {self.user.email} en {self.testimonio.author_name}"