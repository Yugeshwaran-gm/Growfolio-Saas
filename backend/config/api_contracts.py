from rest_framework.response import Response
from rest_framework import status as drf_status


def api_success(data=None, *, status_code=drf_status.HTTP_200_OK, **extra):
    payload = {"data": data}
    payload.update(extra)
    return Response(payload, status=status_code)


def api_error(message, *, status_code=drf_status.HTTP_400_BAD_REQUEST, **extra):
    payload = {
        "error": message,
        "detail": message,
    }
    payload.update(extra)
    return Response(payload, status=status_code)