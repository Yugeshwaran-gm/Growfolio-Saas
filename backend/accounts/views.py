from rest_framework import generics
from django.utils import timezone
from datetime import timedelta
from .models import User, PasswordResetToken
from .serializers import RegisterSerializer, ForgotPasswordSerializer, ResetPasswordSerializer, ChangePasswordSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import get_user_model
import os
from .utils import send_reset_email

User = get_user_model()

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer

class ForgotPasswordView(APIView):

    def post(self, request):

        serializer = ForgotPasswordSerializer(data=request.data)

        if serializer.is_valid():

            email = serializer.validated_data["email"]

            try:
                user = User.objects.get(email=email)

                # remove existing tokens for this user
                PasswordResetToken.objects.filter(user=user).delete()

                # create new reset token
                reset_token = PasswordResetToken.objects.create(user=user)

                frontend_url = os.getenv("FRONTEND_URL")

                reset_link = f"{frontend_url}/reset-password/{reset_token.token}"

                send_reset_email(email, reset_link)

                return Response(
                    {"message": "Password reset link sent"},
                    status=status.HTTP_200_OK
                )

            except User.DoesNotExist:

                return Response(
                    {"error": "User not found"},
                    status=status.HTTP_404_NOT_FOUND
                )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST) 

class ResetPasswordView(APIView):

    def post(self, request, token):

        serializer = ResetPasswordSerializer(data=request.data)

        if serializer.is_valid():

            password = serializer.validated_data["password"]

            try:

                reset_token = PasswordResetToken.objects.get(token=token)

                # check if already used
                if reset_token.is_used:
                    return Response(
                        {"error": "Token already used"},
                        status=status.HTTP_400_BAD_REQUEST
                    )

                # check expiry (15 minutes)
                expiry_time = reset_token.created_at + timedelta(minutes=15)

                if timezone.now() > expiry_time:
                    return Response(
                        {"error": "Token expired"},
                        status=status.HTTP_400_BAD_REQUEST
                    )

                user = reset_token.user

                user.set_password(password)
                user.save()

                # mark token as used
                reset_token.is_used = True
                reset_token.save()

                return Response(
                    {"message": "Password reset successful"},
                    status=status.HTTP_200_OK
                )

            except PasswordResetToken.DoesNotExist:

                return Response(
                    {"error": "Invalid token"},
                    status=status.HTTP_400_BAD_REQUEST
                )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class ChangePasswordView(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request):

        serializer = ChangePasswordSerializer(data=request.data)

        if serializer.is_valid():

            user = request.user
            old_password = serializer.validated_data["old_password"]
            new_password = serializer.validated_data["new_password"]

            # check old password
            if not user.check_password(old_password):

                return Response(
                    {"error": "Old password is incorrect"},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # set new password
            user.set_password(new_password)
            user.save()

            return Response(
                {"message": "Password changed successfully"},
                status=status.HTTP_200_OK
            )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)