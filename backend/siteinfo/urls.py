from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import SiteTextViewSet

router = DefaultRouter()
router.register('content', SiteTextViewSet, basename='sitetext')

urlpatterns = [
    path('', include(router.urls)),
]
