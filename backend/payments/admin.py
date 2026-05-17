from django.contrib import admin

from .models import Donation


@admin.register(Donation)
class DonationAdmin(admin.ModelAdmin):
    list_display = ('id', 'amount_mxn', 'frequency', 'status', 'donor_email', 'created_at')
    list_filter = ('status', 'frequency')
    search_fields = ('donor_email', 'donor_name', 'stripe_payment_intent_id')
    readonly_fields = ('stripe_payment_intent_id', 'stripe_client_secret', 'created_at', 'updated_at')
