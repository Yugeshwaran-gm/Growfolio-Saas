from django.core.management.base import BaseCommand
from django.utils import timezone
from datetime import timedelta
from accounts.models import PasswordResetToken


class Command(BaseCommand):

    help = "Delete expired password reset tokens"

    def handle(self, *args, **kwargs):

        expiry_time = timezone.now() - timedelta(minutes=15)

        deleted_tokens = PasswordResetToken.objects.filter(
            created_at__lt=expiry_time
        ).delete()
        
        PasswordResetToken.objects.filter(is_used=True).delete()
        
        self.stdout.write(
            self.style.SUCCESS(f"Deleted {deleted_tokens[0]} expired tokens")
        )