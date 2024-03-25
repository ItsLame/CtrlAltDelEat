from django.urls import path
from orders import views

urlpatterns = [
    path('addtocart/', views.AddToCartAPIView.as_view()),
    path('getCartForTable/', views.GetCartForTableAPIView.as_view()),
    path('orderitems/', views.OrderCreateAPIView.as_view())

    ## endpoint to remove orders and items when customer clicks on payment
]