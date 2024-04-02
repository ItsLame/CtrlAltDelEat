from django.urls import path
from menu import views
app_name = 'menu'
urlpatterns = [
    path('', views.MenuListAPIView.as_view()),
    path('menuitems/', views.MenuItemListCreateAPIView.as_view()),
    path(
        'menuitems/<uuid:uuid>/',
        views.MenuItemDetailAPIView.as_view(),
        name='menuitem-detail',
    ),
    path('menuitems/<uuid:uuid>/update/', views.MenuItemUpdateAPIView.as_view()),
    path('menuitems/<uuid:uuid>/delete/', views.MenuItemDestroyAPIView.as_view()),

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
    path(
        'menuitems/images/',
        views.MenuItemImageListCreateAPIView.as_view(),
    ),


]
