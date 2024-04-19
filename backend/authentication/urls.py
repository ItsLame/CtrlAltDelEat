from django.urls import path, include
from rest_framework_simplejwt import views as jwt_views
from rest_framework_simplejwt.views import TokenBlacklistView
from authentication.views import CustomTokenObtainPairView
from authentication import views

app_name = 'auth'

urlpatterns = [
    # Endpoint for obtaining JWT token pair
    path(
        'token/',
        CustomTokenObtainPairView.as_view(),
        name='token_obtain_pair',
    ),
    # Endpoint for refreshing JWT token
    path(
        'token/refresh/',
        jwt_views.TokenRefreshView.as_view(),
        name='token_refresh',
    ),
    # Endpoint for blacklisting JWT token
    path(
        'token/blacklist/',
        TokenBlacklistView.as_view(),
        name='token_blacklist',
    ),
    # Endpoint for listing and creating users
    path('users/', views.UserListCreateAPIView.as_view()),
    # Endpoint for retrieving, updating, and deleting a specific user
    path(
        'users/<uuid:uuid>',
        views.UserListCreateAPIView.as_view(),
        name='user-detail',
    ),
    # Endpoint for retrieving details of a specific group
    path(
        'groups/<int:pk>',
        views.GroupDetailAPIView.as_view(),
        name='group-detail',
    ),
    # Endpoint for listing and creating groups
    path('groups/', views.GroupListCreateAPIView.as_view()),
]
