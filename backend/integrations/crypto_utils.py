import base64
import hashlib

from cryptography.fernet import Fernet, InvalidToken
from django.conf import settings


ENCRYPTION_PREFIX = "gftok:v1:"


def _build_fernet_key() -> bytes:
    """Build a stable Fernet key from app secret material."""
    secret = getattr(settings, "ACCESS_TOKEN_ENCRYPTION_SECRET", "") or settings.SECRET_KEY
    digest = hashlib.sha256(secret.encode("utf-8")).digest()
    return base64.urlsafe_b64encode(digest)


def encrypt_access_token(value: str | None) -> str | None:
    if not value:
        return value

    if value.startswith(ENCRYPTION_PREFIX):
        return value

    cipher = Fernet(_build_fernet_key())
    encrypted = cipher.encrypt(value.encode("utf-8")).decode("utf-8")
    return f"{ENCRYPTION_PREFIX}{encrypted}"


def decrypt_access_token(value: str | None) -> str | None:
    if not value:
        return value

    if not value.startswith(ENCRYPTION_PREFIX):
        # Backward compatibility for any legacy plaintext records.
        return value

    token = value[len(ENCRYPTION_PREFIX):]
    cipher = Fernet(_build_fernet_key())

    try:
        return cipher.decrypt(token.encode("utf-8")).decode("utf-8")
    except InvalidToken:
        return None
