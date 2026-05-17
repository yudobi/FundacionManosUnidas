from rest_framework import viewsets

from .models import SiteText
from .permissions import IsAdminOrReadOnly
from .serializers import SiteTextSerializer


class SiteTextViewSet(viewsets.ModelViewSet):
    """CRUD de claves de contenido. Lectura pública, escritura solo admin."""

    queryset = SiteText.objects.all().order_by('key')
    serializer_class = SiteTextSerializer
    permission_classes = (IsAdminOrReadOnly,)
    lookup_field = 'key'
    lookup_value_regex = r'[a-zA-Z0-9_\-]+'
