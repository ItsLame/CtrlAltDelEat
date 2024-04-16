from django.urls import path
from tables import views


urlpatterns = [
    path('customer_request_assistance/', views.TableAssistanceRequestedView.as_view(), name='table-assistance'),
    path('assistance_requested/', views.TableAssistanceRequestedAPIViewList.as_view(), name='table-assistance'),
    path('assisted/<int:tableNumber>', views.TableAssistedAPIView.as_view(), name='table-assisted')
]