from django.urls import path, include
from rest_framework_simplejwt import views as jwt_views
from rest_framework_simplejwt.views import TokenBlacklistView
from authentication.views import CustomTokenObtainPairView
from authentication import views
app_name='auth'
urlpatterns = [
    path(
        'token/',
        # jwt_views.TokenObtainPairView.as_view(),
        CustomTokenObtainPairView.as_view(),
        name='token_obtain_pair',
    ),
    path(
        'token/refresh/',
        jwt_views.TokenRefreshView.as_view(),
        name='token_refresh',
    ),
    path(
        'token/blacklist/',
        TokenBlacklistView.as_view(),
        name='token_blacklist',
    ),
    path('users/', views.UserListCreateAPIView.as_view()),
    path('users/<uuid:uuid>', views.UserListCreateAPIView.as_view(), name='user-detail'),
    path('groups/<int:pk>', views.GroupDetailAPIView.as_view(), name='group-detail'),
    path('groups/', views.GroupListCreateAPIView.as_view()),
]
