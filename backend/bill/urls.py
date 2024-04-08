from django.urls import path
from bill import views

urlpatterns = [
    path('generateBill/', views.GenerateBillView.as_view()),
]