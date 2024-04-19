from django.urls import path
from menu import views

app_name = 'menu'

urlpatterns = [
    # Endpoint for retrieving the list of all menus
    path('', views.MenuListAPIView.as_view()),
    # Endpoint for creating and listing menu items
    path('menuitems/', views.MenuItemListCreateAPIView.as_view()),
    # Endpoint for retrieving, updating, and deleting a specific menu item
    path(
        'menuitems/<uuid:uuid>/',
        views.MenuItemDetailAPIView.as_view(),
        name='menuitem-detail',
    ),
    path(
        'menuitems/<uuid:uuid>/update/', views.MenuItemUpdateAPIView.as_view()
    ),
    path(
        'menuitems/<uuid:uuid>/delete/', views.MenuItemDestroyAPIView.as_view()
    ),
    # Endpoint for creating and listing categories
    path(
        'categories/',
        views.CategoryListCreateAPIView.as_view(),
        name='category-list-create',
    ),
    # Endpoint for retrieving, updating, and deleting a specific category
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
    # Endpoint for creating and listing menu item images
    path(
        'menuitems/images/',
        views.MenuItemImageListCreateAPIView.as_view(),
    ),
    # Endpoint for updating the position of menu items
    path('menuitems/reorder/', views.UpdateMenuItemPositionAPIView.as_view()),
    # Endpoint for updating the position of categories
    path('categories/reorder/', views.UpdateCategoryPositionAPIView.as_view()),
]
