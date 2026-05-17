from django.db import models

# Create your models here.
from django.db import models
from django.utils import timezone
from django.core.validators import MinValueValidator, MaxValueValidator
from django.conf import settings
from django.utils.text import slugify


class CategoriaProyecto(models.Model):
    """Categorías para clasificar proyectos"""
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(max_length=100, unique=True, blank=True)
    description = models.TextField(blank=True)
    icon = models.CharField(max_length=50, blank=True, help_text="Clase CSS del ícono")
    order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ['order', 'name']
        verbose_name = "Categoría de proyecto"
        verbose_name_plural = "Categorías de proyectos"

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)


# ==================== PROYECTOS REALIZADOS ====================

class ProyectoRealizado(models.Model):
    """Proyectos ya completados con galería antes/después"""
    
    class ImpactoNivel(models.TextChoices):
        BAJO = 'BAJO', 'Impacto Bajo'
        MEDIO = 'MEDIO', 'Impacto Medio'
        ALTO = 'ALTO', 'Impacto Alto'
        MUY_ALTO = 'MUY_ALTO', 'Impacto Muy Alto'
    
    # Información básica
    title = models.CharField(max_length=200, verbose_name="Título del proyecto")
    slug = models.SlugField(max_length=200, unique=True, blank=True)
    description = models.TextField(verbose_name="Descripción del proyecto")
    
    # Categoría
    categoria = models.ForeignKey(
        CategoriaProyecto,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='proyectos_realizados'
    )
    
    # Fechas
    start_date = models.DateField(verbose_name="Fecha de inicio")
    end_date = models.DateField(verbose_name="Fecha de finalización")
    
    # Ubicación
    location = models.CharField(max_length=200, verbose_name="Ubicación")
    latitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    
    # Impacto y métricas
    impacto_nivel = models.CharField(
        max_length=20,
        choices=ImpactoNivel.choices,
        default=ImpactoNivel.MEDIO
    )
    beneficiarios = models.PositiveIntegerField(
        default=0,
        verbose_name="Número de beneficiarios",
        help_text="Cantidad de personas beneficiadas"
    )
    voluntarios = models.PositiveIntegerField(
        default=0,
        verbose_name="Voluntarios participantes"
    )
    
    # Inversión
    inversion_total = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=0,
        verbose_name="Inversión total ($)"
    )
    
    # Multimedia
    cover_image = models.ImageField(
        upload_to='proyectos/realizados/cover/%Y/',
        verbose_name="Imagen de portada"
    )
    
    # Galería principal (se manejará con modelo aparte)
    # Video destacado
    video_url = models.URLField(blank=True, verbose_name="Video destacado (YouTube/Vimeo)")
    
    # Estadísticas de interacción
    views = models.PositiveIntegerField(default=0)
    likes = models.PositiveIntegerField(default=0)
    
    # Publicación
    is_published = models.BooleanField(default=True)
    published_at = models.DateTimeField(default=timezone.now)
    
    # Auditoría
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name='created_proyectos_realizados'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-end_date', '-start_date']
        verbose_name = "Proyecto realizado"
        verbose_name_plural = "Proyectos realizados"

    def __str__(self):
        return self.title

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)
    
    def add_view(self):
        self.views += 1
        self.save(update_fields=['views'])
    
    def add_like(self):
        self.likes += 1
        self.save(update_fields=['likes'])


class ImagenAntesDespues(models.Model):
    """Galería de imágenes antes/después para proyectos realizados"""
    proyecto = models.ForeignKey(
        ProyectoRealizado,
        on_delete=models.CASCADE,
        related_name='imagenes_antes_despues'
    )
    title = models.CharField(max_length=200, blank=True)
    description = models.TextField(blank=True)
    image_before = models.ImageField(
        upload_to='proyectos/realizados/antes/%Y/',
        verbose_name="Imagen ANTES"
    )
    image_after = models.ImageField(
        upload_to='proyectos/realizados/despues/%Y/',
        verbose_name="Imagen DESPUÉS"
    )
    order = models.PositiveIntegerField(default=0)
    is_featured = models.BooleanField(default=False)

    class Meta:
        ordering = ['order']
        verbose_name = "Imagen Antes/Después"
        verbose_name_plural = "Imágenes Antes/Después"

    def __str__(self):
        return f"{self.proyecto.title} - Antes/Después {self.order}"


class GaleriaProyectoRealizado(models.Model):
    """Galería adicional de imágenes del proyecto"""
    proyecto = models.ForeignKey(
        ProyectoRealizado,
        on_delete=models.CASCADE,
        related_name='galeria'
    )
    image = models.ImageField(upload_to='proyectos/realizados/galeria/%Y/')
    title = models.CharField(max_length=200, blank=True)
    description = models.TextField(blank=True)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order']
        verbose_name = "Imagen de galería"
        verbose_name_plural = "Galería de imágenes"

    def __str__(self):
        return f"{self.proyecto.title} - Imagen {self.order}"


# ==================== PROYECTOS EN PROGRESO ====================

class ProyectoEnProgreso(models.Model):
    """Proyectos actualmente en desarrollo"""
    
    class Estado(models.TextChoices):
        PLANIFICACION = 'PLANIFICACION', 'En planificación'
        EN_CURSO = 'EN_CURSO', 'En curso'
        PAUSADO = 'PAUSADO', 'Pausado'
        CASI_COMPLETADO = 'CASI_COMPLETADO', 'Casi completado'
    
    class Urgencia(models.TextChoices):
        BAJA = 'BAJA', 'Baja'
        MEDIA = 'MEDIA', 'Media'
        ALTA = 'ALTA', 'Alta'
        CRITICA = 'CRITICA', 'Crítica'
    
    # Información básica
    title = models.CharField(max_length=200, verbose_name="Título del proyecto")
    slug = models.SlugField(max_length=200, unique=True, blank=True)
    description = models.TextField(verbose_name="Descripción del proyecto")
    
    # Categoría
    categoria = models.ForeignKey(
        CategoriaProyecto,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='proyectos_progreso'
    )
    
    # Estado y urgencia
    estado = models.CharField(
        max_length=20,
        choices=Estado.choices,
        default=Estado.PLANIFICACION
    )
    urgencia = models.CharField(
        max_length=20,
        choices=Urgencia.choices,
        default=Urgencia.MEDIA
    )
    
    # Fechas
    start_date = models.DateField(verbose_name="Fecha de inicio")
    estimated_end_date = models.DateField(
        verbose_name="Fecha estimada de finalización",
        null=True,
        blank=True
    )
    
    # Ubicación
    location = models.CharField(max_length=200, verbose_name="Ubicación")
    latitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    
    # Donaciones y financiamiento
    meta_donacion = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=0,
        verbose_name="Meta de donación ($)",
        help_text="Monto total necesario para el proyecto"
    )
    recaudado = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=0,
        verbose_name="Monto recaudado ($)"
    )
    
    # Necesidades del proyecto
    necesidades = models.TextField(
        verbose_name="Necesidades del proyecto",
        help_text="Qué necesita el proyecto (materiales, fondos, voluntarios, etc.)"
    )
    
    # Voluntarios necesarios
    voluntarios_necesarios = models.PositiveIntegerField(default=0)
    voluntarios_actuales = models.PositiveIntegerField(default=0)
    
    # Multimedia
    cover_image = models.ImageField(
        upload_to='proyectos/progreso/cover/%Y/',
        verbose_name="Imagen de portada"
    )
    video_url = models.URLField(blank=True, verbose_name="Video promocional")
    
    # Avance del proyecto
    avance_porcentaje = models.PositiveIntegerField(
        default=0,
        validators=[MaxValueValidator(100)],
        verbose_name="% de avance"
    )
    
    # Donaciones destacadas
    donacion_destacada_monto = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        null=True,
        blank=True,
        verbose_name="Donación destacada"
    )
    donacion_destacada_nombre = models.CharField(
        max_length=200,
        blank=True,
        verbose_name="Nombre del donante destacado"
    )
    
    # Estadísticas
    views = models.PositiveIntegerField(default=0)
    likes = models.PositiveIntegerField(default=0)
    
    # Publicación
    is_published = models.BooleanField(default=True)
    published_at = models.DateTimeField(default=timezone.now)
    
    # Auditoría
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name='created_proyectos_progreso'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-urgencia', '-avance_porcentaje', '-created_at']
        verbose_name = "Proyecto en progreso"
        verbose_name_plural = "Proyectos en progreso"

    def __str__(self):
        return f"{self.title} - {self.avance_porcentaje}%"

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)
    
    @property
    def porcentaje_recaudado(self):
        """Calcular porcentaje de meta alcanzada"""
        if self.meta_donacion > 0:
            return (self.recaudado / self.meta_donacion) * 100
        return 0
    
    @property
    def porcentaje_voluntarios(self):
        """Calcular porcentaje de voluntarios cubiertos"""
        if self.voluntarios_necesarios > 0:
            return (self.voluntarios_actuales / self.voluntarios_necesarios) * 100
        return 0
    
    def add_donation(self, amount):
        """Agregar una donación al proyecto"""
        self.recaudado += amount
        self.save(update_fields=['recaudado'])
    
    def add_volunteer(self):
        """Agregar un voluntario al proyecto"""
        if self.voluntarios_actuales < self.voluntarios_necesarios:
            self.voluntarios_actuales += 1
            self.save(update_fields=['voluntarios_actuales'])
    
    def add_view(self):
        self.views += 1
        self.save(update_fields=['views'])
    
    def add_like(self):
        self.likes += 1
        self.save(update_fields=['likes'])


class NecesidadEspecifica(models.Model):
    """Necesidades específicas del proyecto (para listar items)"""
    
    proyecto = models.ForeignKey(
        ProyectoEnProgreso,
        on_delete=models.CASCADE,
        related_name='necesidades_especificas'
    )
    
    class TipoNecesidad(models.TextChoices):
        ECONOMICA = 'ECONOMICA', 'Económica'
        MATERIAL = 'MATERIAL', 'Material'
        VOLUNTARIADO = 'VOLUNTARIADO', 'Voluntariado'
        EQUIPO = 'EQUIPO', 'Equipo'
        INFRAESTRUCTURA = 'INFRAESTRUCTURA', 'Infraestructura'
        OTRO = 'OTRO', 'Otro'
    
    tipo = models.CharField(max_length=20, choices=TipoNecesidad.choices)
    descripcion = models.TextField()
    cantidad_necesaria = models.PositiveIntegerField(default=1)
    cantidad_cubierta = models.PositiveIntegerField(default=0)
    es_urgente = models.BooleanField(default=False)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order', '-es_urgente']
        verbose_name = "Necesidad específica"
        verbose_name_plural = "Necesidades específicas"

    def __str__(self):
        return f"{self.get_tipo_display()}: {self.descripcion[:50]}"


class GaleriaProyectoProgreso(models.Model):
    """Galería de imágenes del proyecto en progreso"""
    proyecto = models.ForeignKey(
        ProyectoEnProgreso,
        on_delete=models.CASCADE,
        related_name='galeria'
    )
    image = models.ImageField(upload_to='proyectos/progreso/galeria/%Y/')
    title = models.CharField(max_length=200, blank=True)
    description = models.TextField(blank=True)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order']
        verbose_name = "Imagen de galería"
        verbose_name_plural = "Galería de imágenes"

    def __str__(self):
        return f"{self.proyecto.title} - Imagen {self.order}"


class ActualizacionProyecto(models.Model):
    """Actualizaciones de progreso del proyecto (como un blog)"""
    
    proyecto = models.ForeignKey(
        ProyectoEnProgreso,
        on_delete=models.CASCADE,
        related_name='actualizaciones'
    )
    title = models.CharField(max_length=200)
    content = models.TextField()
    image = models.ImageField(upload_to='proyectos/progreso/updates/%Y/', blank=True, null=True)
    published_at = models.DateTimeField(default=timezone.now)
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name='proyecto_actualizaciones'
    )

    class Meta:
        ordering = ['-published_at']
        verbose_name = "Actualización de proyecto"
        verbose_name_plural = "Actualizaciones de proyectos"

    def __str__(self):
        return f"{self.proyecto.title} - {self.title}"