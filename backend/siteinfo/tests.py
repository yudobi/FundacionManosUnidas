"""Tests del CRUD de contenido editable."""
from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.test import APITestCase

from .models import SiteText

User = get_user_model()


class SiteContentTests(APITestCase):
    def setUp(self):
        self.admin = User.objects.create_user(
            username='boss',
            email='boss@example.com',
            password='supersecret123',
            role=User.Role.ADMIN,
        )
        SiteText.objects.create(
            key='mission',
            label='Misión',
            value={'body': 'Misión original.'},
        )

    def _admin_token(self):
        login = self.client.post(
            '/api/auth/login/',
            {'email': 'boss@example.com', 'password': 'supersecret123'},
            format='json',
        )
        return login.data['access']

    def test_list_public(self):
        r = self.client.get('/api/site/content/')
        self.assertEqual(r.status_code, status.HTTP_200_OK)
        self.assertEqual(len(r.data), 1)

    def test_detail_public(self):
        r = self.client.get('/api/site/content/mission/')
        self.assertEqual(r.status_code, status.HTTP_200_OK)
        self.assertEqual(r.data['value']['body'], 'Misión original.')

    def test_patch_requires_auth(self):
        r = self.client.patch(
            '/api/site/content/mission/',
            {'value': {'body': 'hacked'}},
            format='json',
        )
        self.assertEqual(r.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_patch_admin_updates_value(self):
        token = self._admin_token()
        r = self.client.patch(
            '/api/site/content/mission/',
            {'value': {'body': 'Misión actualizada.'}},
            format='json',
            HTTP_AUTHORIZATION=f'Bearer {token}',
        )
        self.assertEqual(r.status_code, status.HTTP_200_OK)
        self.assertEqual(r.data['value']['body'], 'Misión actualizada.')
