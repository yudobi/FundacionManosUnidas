# users/urls.py
from django.urls import path
from .views import (
    CustomTokenObtainPairView, RegisterView, UserProfileView, 
    ChangePasswordView, LogoutView, UserHistoryView, UserStatsView
)

urlpatterns = [
    path('login/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('register/', RegisterView.as_view(), name='register'),
    path('profile/', UserProfileView.as_view(), name='profile'),
    path('change-password/', ChangePasswordView.as_view(), name='change_password'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('history/', UserHistoryView.as_view(), name='history'),
    path('stats/', UserStatsView.as_view(), name='stats'),
]