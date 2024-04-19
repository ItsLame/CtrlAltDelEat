from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient, APITestCase
from django.contrib.auth.models import User
from menu.models import Category, MenuItem
from rest_framework_simplejwt.tokens import RefreshToken

# Create your tests here.


class CategoryTestCase(APITestCase):
    def setUp(self):
        self.user = User.objects.create_superuser(
            username='test_user', password='test'
        )
        self.client = APIClient()
        self.client.force_authenticate(user=self.user)
        self.data = {'category_name': 'Mains'}
        self.url = reverse('menu:category-list-create')

    def test_create_category(self):
        data = self.data
        response = self.client.post(self.url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Category.objects.count(), 1)
        self.assertEqual(Category.objects.get().category_name, 'Mains')


class AuthenticationTestCase(APITestCase):
    def setUp(self):
        self.user = User.objects.create_superuser(
            username='test_user', password='test'
        )
        self.client = APIClient()
        refresh = RefreshToken.for_user(user=self.user)
        self.client.credentials(
            HTTP_AUTHORIZATION=f'Bearer {refresh.access_token}'
        )
        self.data = {'category_name': 'Mains'}
        self.url = reverse('menu:category-list-create')

    def test_create_category(self):
        data = self.data
        response = self.client.post(self.url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Category.objects.count(), 1)
        self.assertEqual(Category.objects.get().category_name, 'Mains')
