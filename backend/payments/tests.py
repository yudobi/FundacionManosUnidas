"""Tests del endpoint de create-intent en modo demo (sin Stripe real)."""
from rest_framework import status
from rest_framework.test import APITestCase

from .models import Donation


class PaymentIntentTests(APITestCase):
    def test_create_intent_demo_mode(self):
        r = self.client.post(
            '/api/payments/create-intent/',
            {
                'amount': 500,
                'frequency': 'Una vez',
                'destination': 'fondo general',
                'donor_email': 'd@example.com',
            },
            format='json',
        )
        self.assertEqual(r.status_code, status.HTTP_201_CREATED)
        self.assertEqual(r.data['mode'], 'demo')
        self.assertTrue(r.data['client_secret'].startswith('demo_'))
        self.assertEqual(Donation.objects.count(), 1)
        d = Donation.objects.first()
        self.assertEqual(d.amount_mxn, 500)
        self.assertEqual(d.frequency, 'once')

    def test_create_intent_too_small(self):
        r = self.client.post(
            '/api/payments/create-intent/',
            {'amount': 10},
            format='json',
        )
        self.assertEqual(r.status_code, status.HTTP_400_BAD_REQUEST)

    def test_create_intent_invalid_amount(self):
        r = self.client.post(
            '/api/payments/create-intent/',
            {'amount': 'not-a-number'},
            format='json',
        )
        self.assertEqual(r.status_code, status.HTTP_400_BAD_REQUEST)

    def test_frequency_mapping(self):
        for raw, expected in [('Mensual', 'monthly'), ('Anual', 'yearly'), ('Una vez', 'once')]:
            self.client.post(
                '/api/payments/create-intent/',
                {'amount': 200, 'frequency': raw},
                format='json',
            )
        amounts = list(Donation.objects.values_list('frequency', flat=True).order_by('id'))
        self.assertEqual(amounts, ['monthly', 'yearly', 'once'])
