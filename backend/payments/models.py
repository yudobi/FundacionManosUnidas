from django.conf import settings
from django.db import models


class Donation(models.Model):
    class Status(models.TextChoices):
        PENDING = 'pending', 'Pendiente'
        SUCCEEDED = 'succeeded', 'Completada'
        FAILED = 'failed', 'Fallida'
        REFUNDED = 'refunded', 'Reembolsada'

    class Frequency(models.TextChoices):
        ONCE = 'once', 'Una vez'
        MONTHLY = 'monthly', 'Mensual'
        YEARLY = 'yearly', 'Anual'

    amount_mxn = models.PositiveIntegerField()
    frequency = models.CharField(max_length=10, choices=Frequency.choices)
    destination = models.CharField(max_length=120, blank=True, default='')
    status = models.CharField(
        max_length=12, choices=Status.choices, default=Status.PENDING
    )

    donor_name = models.CharField(max_length=120, blank=True, default='')
    donor_email = models.EmailField(blank=True, default='')
    donor_phone = models.CharField(max_length=32, blank=True, default='')
    donor_rfc = models.CharField(max_length=16, blank=True, default='')

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        related_name='donations',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
    )

    # Identificadores de Stripe (vacíos en modo demo)
    stripe_payment_intent_id = models.CharField(max_length=64, blank=True, default='')
    stripe_client_secret = models.CharField(max_length=128, blank=True, default='')

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self) -> str:
        return f'Donación #{self.pk} · ${self.amount_mxn} MXN ({self.status})'
