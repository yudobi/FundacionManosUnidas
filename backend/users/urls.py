# users/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView

from .views import (
    CustomTokenObtainPairView, RegisterView, UserProfileView,
    ChangePasswordView, LogoutView, UserHistoryView, UserStatsView
)
from .admin_views import UserAdminViewSet

admin_router = DefaultRouter()
admin_router.register('', UserAdminViewSet, basename='admin-user')

urlpatterns = [
    path('login/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('register/', RegisterView.as_view(), name='register'),
    path('profile/', UserProfileView.as_view(), name='profile'),
    path('change-password/', ChangePasswordView.as_view(), name='change_password'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('history/', UserHistoryView.as_view(), name='history'),
    path('stats/', UserStatsView.as_view(), name='stats'),
    path('manage/', include(admin_router.urls)),
]