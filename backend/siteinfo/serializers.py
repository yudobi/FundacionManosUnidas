from rest_framework import serializers

from .models import SiteText


class SiteTextSerializer(serializers.ModelSerializer):
    class Meta:
        model = SiteText
        fields = ('key', 'value', 'label', 'updated_at')
        read_only_fields = ('updated_at',)
