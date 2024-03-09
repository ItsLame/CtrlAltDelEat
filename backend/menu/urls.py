from django.urls import path
from menu import views

urlpatterns = [
    path('', views.MenuListAPIView.as_view()),
    path('menuitems/', views.MenuItemListCreateAPIView.as_view()),
    path(
        'menuitems/<uuid:uuid>',
        views.MenuItemListCreateAPIView.as_view(),
        name='menuitem-detail',
    ),
    path('categories/', views.CategoryListCreateAPIView.as_view()),
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
    # path('ingredients/', views.IngredientListCreateAPIView.as_view()),
    # path('ingredients/<uuid:uuid>/', views.IngredientDetailAPIView.as_view(), name='ingredient-detail'),
    # path('ingredients/<uuid:uuid>/update/', views.IngredientUpdateAPIView.as_view()),
    # path('ingredients/<uuid:uuid>/delete/', views.IngredientDestroyAPIView.as_view()),
    # path('tags/', views.TagListCreateAPIView.as_view()),
    # path('tags/<uuid:uuid>/', views.TagDetailAPIView.as_view(), name='tag-detail'),
    # path('tags/<uuid:uuid>/update/', views.TagUpdateAPIView.as_view()),
    # path('tags/<uuid:uuid>/delete/', views.TagDestroyAPIView.as_view()),
]
