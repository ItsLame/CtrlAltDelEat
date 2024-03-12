from django.urls import path
from orders import views

urlpatterns = [
    path('orderitems/', views.OrderCreateAPIView.as_view()),
]