"""Endpoint para crear PaymentIntent de Stripe.

Modo:
- Si STRIPE_SECRET_KEY está configurado en settings (env), se llama a Stripe.
- Si no, devuelve un client_secret "demo_xxx" útil para probar el flujo UI.

Cuando estés listo para producción:
1. pip install stripe
2. Añadir STRIPE_SECRET_KEY y STRIPE_WEBHOOK_SECRET a settings.py vía .env
3. Descomentar el bloque marcado más abajo.
4. Configurar webhook /api/payments/webhook/ en el dashboard de Stripe para
   recibir payment_intent.succeeded.
"""
import logging
from typing import Any

from django.conf import settings
from django.utils.crypto import get_random_string
from rest_framework import permissions, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response

from .models import Donation

logger = logging.getLogger(__name__)


def _create_stripe_intent(amount_cents: int, donation: Donation) -> dict[str, Any] | None:
    """Llama a Stripe si la lib está disponible y hay clave configurada."""
    secret = getattr(settings, 'STRIPE_SECRET_KEY', '')
    if not secret:
        return None
    try:
        import stripe  # type: ignore[import-not-found]
    except ImportError:
        logger.warning('stripe lib no instalada — usando modo demo.')
        return None
    stripe.api_key = secret
    intent = stripe.PaymentIntent.create(
        amount=amount_cents,
        currency='mxn',
        metadata={
            'donation_id': str(donation.pk),
            'destination': donation.destination,
            'frequency': donation.frequency,
        },
    )
    return {
        'id': intent['id'],
        'client_secret': intent['client_secret'],
    }


@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def create_payment_intent(request):
    """POST /api/payments/create-intent/ — crea una donación y devuelve client_secret."""
    data = request.data
    try:
        amount_mxn = int(data.get('amount', 0))
    except (TypeError, ValueError):
        return Response(
            {'detail': 'amount inválido.'}, status=status.HTTP_400_BAD_REQUEST
        )
    if amount_mxn < 50:
        return Response(
            {'detail': 'Monto mínimo: $50 MXN.'},
            status=status.HTTP_400_BAD_REQUEST,
        )

    freq_raw = (data.get('frequency') or 'Una vez').strip().lower()
    freq_map = {
        'una vez': Donation.Frequency.ONCE,
        'once': Donation.Frequency.ONCE,
        'mensual': Donation.Frequency.MONTHLY,
        'monthly': Donation.Frequency.MONTHLY,
        'anual': Donation.Frequency.YEARLY,
        'yearly': Donation.Frequency.YEARLY,
    }
    frequency = freq_map.get(freq_raw, Donation.Frequency.ONCE)

    donation = Donation.objects.create(
        amount_mxn=amount_mxn,
        frequency=frequency,
        destination=(data.get('destination') or '')[:120],
        donor_name=(data.get('donor_name') or '')[:120],
        donor_email=(data.get('donor_email') or '')[:200],
        donor_phone=(data.get('donor_phone') or '')[:32],
        donor_rfc=(data.get('donor_rfc') or '')[:16],
        user=request.user if request.user.is_authenticated else None,
    )

    # Stripe expects amount in cents (centavos)
    amount_cents = amount_mxn * 100
    stripe_data = _create_stripe_intent(amount_cents, donation)

    if stripe_data:
        donation.stripe_payment_intent_id = stripe_data['id']
        donation.stripe_client_secret = stripe_data['client_secret']
        donation.save(update_fields=['stripe_payment_intent_id', 'stripe_client_secret'])
        return Response(
            {
                'mode': 'live',
                'donation_id': donation.pk,
                'client_secret': stripe_data['client_secret'],
                'publishable_key': getattr(settings, 'STRIPE_PUBLISHABLE_KEY', ''),
            },
            status=status.HTTP_201_CREATED,
        )

    # Modo demo: client_secret falso. La UI puede mostrar "Pago demo procesado".
    demo_secret = f'demo_{get_random_string(24).lower()}'
    donation.stripe_client_secret = demo_secret
    donation.save(update_fields=['stripe_client_secret'])
    return Response(
        {
            'mode': 'demo',
            'donation_id': donation.pk,
            'client_secret': demo_secret,
            'publishable_key': '',
            'detail': (
                'Modo demo: Stripe no está configurado. Define STRIPE_SECRET_KEY '
                'en settings.py para procesar pagos reales.'
            ),
        },
        status=status.HTTP_201_CREATED,
    )


# Cuando habilites Stripe real, añade aquí el webhook:
# @api_view(['POST'])
# @permission_classes([permissions.AllowAny])
# def webhook(request):
#     payload = request.body
#     sig = request.META.get('HTTP_STRIPE_SIGNATURE', '')
#     import stripe
#     try:
#         event = stripe.Webhook.construct_event(
#             payload, sig, settings.STRIPE_WEBHOOK_SECRET
#         )
#     except (ValueError, stripe.error.SignatureVerificationError):
#         return Response(status=400)
#     if event['type'] == 'payment_intent.succeeded':
#         intent = event['data']['object']
#         Donation.objects.filter(
#             stripe_payment_intent_id=intent['id']
#         ).update(status=Donation.Status.SUCCEEDED)
#     return Response({'received': True})
