from django.urls import path
from tables import views


urlpatterns = [
    path('assistance_requested/', views.TableAssistanceRequestedAPIView.as_view(), name='table-assistance'),
    path('assisted/<int:tableNumber>', views.TableAssistedAPIView.as_view(), name='table-assisted')

]

