from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TestimonioViewSet, TestimonioComentarioViewSet

router = DefaultRouter()
router.register(r'testimonios', TestimonioViewSet)
router.register(
    r'testimonios/(?P<testimonio_pk>\d+)/comentarios',
    TestimonioComentarioViewSet,
    basename='testimonio-comentarios'
)

urlpatterns = [
    path('', include(router.urls)),
]