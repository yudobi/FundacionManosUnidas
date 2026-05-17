from django.db import models


class SiteText(models.Model):
    """Tabla clave-valor para todo el contenido editable del sitio:
    mision, vision, valores (json list), stats (json), banco, contacto, etc.
    """
    key = models.SlugField(primary_key=True, max_length=64)
    value = models.JSONField(default=dict, blank=True)
    label = models.CharField(max_length=200, blank=True, default='')
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['key']

    def __str__(self) -> str:
        return self.key
