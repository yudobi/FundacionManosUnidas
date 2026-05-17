"""Inserta los bloques de contenido editable del sitio."""
from django.core.management.base import BaseCommand

from siteinfo.models import SiteText

CONTENT = [
    {
        'key': 'mission',
        'label': 'Misión',
        'value': {
            'body': (
                'Construir puentes entre quienes tienen y quienes necesitan, '
                'con transparencia radical y dignidad como principio.'
            ),
        },
    },
    {
        'key': 'vision',
        'label': 'Visión',
        'value': {
            'body': (
                'Una sociedad donde dar y recibir sea un acto cotidiano, '
                'sin estigma y sin intermediarios opacos.'
            ),
        },
    },
    {
        'key': 'values',
        'label': 'Valores',
        'value': {
            'items': ['Transparencia', 'Dignidad', 'Cercanía', 'Acción', 'Comunidad'],
        },
    },
    {
        'key': 'stats',
        'label': 'Estadísticas (banner Resultados)',
        'value': {
            'families': '1,842',
            'projects': '126',
            'volunteers': '340',
            'amount': '8.4',
            'amount_unit': 'M MXN',
            'updated_at': '01 · 05 · 2026',
        },
    },
    {
        'key': 'bank',
        'label': 'Datos bancarios',
        'value': {
            'bank': 'BBVA México',
            'beneficiary': 'Fund. Manos Unidas P.E.A.C, A.C.',
            'account': '0123 4567 89',
            'clabe': '012 650 0123 4567 8901',
            'rfc': 'FMU140312XX0',
            'email': 'donaciones@fundacionmanosunidaspeac.mx',
        },
    },
    {
        'key': 'office',
        'label': 'Oficina y contacto',
        'value': {
            'address': 'Av. Reforma Norte 1204, Col. Centro,\n72000 Puebla, Pue. México',
            'hours': 'Lun – Vie · 9:00 – 18:00\nSáb · brigadas en campo',
            'phone': '+52 222 123 4567',
            'contact_email': 'hola@fundacionmanosunidaspeac.mx',
            'donations_email': 'donaciones@fundacionmanosunidaspeac.mx',
        },
    },
]


class Command(BaseCommand):
    help = 'Inserta los bloques de contenido editable.'

    def add_arguments(self, parser):
        parser.add_argument(
            '--reset', action='store_true',
            help='Borra todos los registros antes.',
        )

    def handle(self, *args, **options):
        if options['reset']:
            count, _ = SiteText.objects.all().delete()
            self.stdout.write(self.style.WARNING(f'Borrados {count} registros previos.'))

        created, updated = 0, 0
        for data in CONTENT:
            _, was_created = SiteText.objects.update_or_create(
                key=data['key'], defaults={'label': data['label'], 'value': data['value']}
            )
            if was_created:
                created += 1
            else:
                updated += 1

        self.stdout.write(self.style.SUCCESS(
            f'Contenido: {created} creados, {updated} actualizados.'
        ))
