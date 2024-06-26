from django.urls import path
from orders import views

urlpatterns = [
    path('addtocart/', views.AddToCartAPIView.as_view()),
    path('getCartForTable/', views.GetCartForTableAPIView.as_view()),
    path('removeFromCart/<int:pk>', views.RemoveFromCartAPIView.as_view()),
    path('viewReceivedOrders/', views.GetOrderAPIView.as_view()),
    path('changeItemStatus/', views.ChangeItemStatusAPIView.as_view()),
    path('viewPreparedOrders/', views.GetPreparedItemsAPIView.as_view()),
    path('orderTable/', views.CustomerOrderCreateView.as_view()),
    path('viewOrderHistory/', views.CustomerOrderHistoryView.as_view())
    ## endpoint to remove orders and items when customer clicks on payment
]