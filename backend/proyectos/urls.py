# proyectos/urls.py - VERSIÓN CORREGIDA
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    CategoriaProyectoViewSet, ProyectoRealizadoViewSet, ImagenAntesDespuesViewSet,
    GaleriaProyectoRealizadoViewSet, ProyectoEnProgresoViewSet,
    NecesidadEspecificaViewSet, GaleriaProyectoProgresoViewSet,
    ActualizacionProyectoViewSet
)

router = DefaultRouter()
router.register(r'categorias', CategoriaProyectoViewSet, basename='categoria')
router.register(r'realizados', ProyectoRealizadoViewSet, basename='proyecto-realizado')
router.register(r'realizados/(?P<proyecto_slug>[-\w]+)/imagenes-antes-despues',
                ImagenAntesDespuesViewSet, basename='imagen-antes-despues')
router.register(r'realizados/(?P<proyecto_slug>[-\w]+)/galeria',
                GaleriaProyectoRealizadoViewSet, basename='galeria-realizado')
router.register(r'en-progreso', ProyectoEnProgresoViewSet, basename='proyecto-en-progreso')
router.register(r'en-progreso/(?P<proyecto_slug>[-\w]+)/necesidades',
                NecesidadEspecificaViewSet, basename='necesidad')
router.register(r'en-progreso/(?P<proyecto_slug>[-\w]+)/galeria',
                GaleriaProyectoProgresoViewSet, basename='galeria-progreso')
router.register(r'en-progreso/(?P<proyecto_slug>[-\w]+)/actualizaciones',
                ActualizacionProyectoViewSet, basename='actualizacion')

urlpatterns = [
    path('', include(router.urls)),
]
