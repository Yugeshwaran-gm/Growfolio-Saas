def get_client_ip(request):
    forwarded_for = request.META.get("HTTP_X_FORWARDED_FOR", "")
    if forwarded_for:
        return forwarded_for.split(",")[0].strip() or request.META.get("REMOTE_ADDR") or "127.0.0.1"

    return request.META.get("REMOTE_ADDR") or "127.0.0.1"