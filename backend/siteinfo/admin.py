from django.contrib import admin

from .models import SiteText


@admin.register(SiteText)
class SiteTextAdmin(admin.ModelAdmin):
    list_display = ('key', 'label', 'updated_at')
    search_fields = ('key', 'label')
