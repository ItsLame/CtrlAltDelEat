from django.urls import path
from menu import views
app_name = 'menu'
urlpatterns = [
    path('', views.MenuListAPIView.as_view()),
    path('menuitems/', views.MenuItemListCreateAPIView.as_view()),
    path(
        'menuitems/<uuid:uuid>',
        views.MenuItemListCreateAPIView.as_view(),
        name='menuitem-detail',
    ),
    path('categories/', views.CategoryListCreateAPIView.as_view(), name='category-list-create'),
    path(
        'categories/<uuid:uuid>/',
        views.CategoryDetailAPIView.as_view(),
        name='category-detail',
    ),
    path(
        'categories/<uuid:uuid>/update/', views.CategoryUpdateAPIView.as_view()
    ),
    path(
        'categories/<uuid:uuid>/delete/',
        views.CategoryDestroyAPIView.as_view(),
    ),


]
