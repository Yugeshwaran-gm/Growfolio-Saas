from django.core.mail import EmailMultiAlternatives
from django.conf import settings


def send_reset_email(email, reset_link):

    subject = "GrowFolio Password Reset"

    text_content = f"""
Hello,

Copy the link below to reset your password:

{reset_link}
"""

    html_content = f"""
<p>Hello,</p>

<p>Click the button below to reset your password.</p>

<p>
<a href="{reset_link}" style="
background-color:#4CAF50;
color:white;
padding:10px 20px;
text-decoration:none;
border-radius:5px;">
Reset Password
</a>
</p>

<p>If you did not request this, ignore this email.</p>
"""

    email_message = EmailMultiAlternatives(
        subject,
        text_content,
        settings.EMAIL_HOST_USER,
        [email],
    )

    email_message.attach_alternative(html_content, "text/html")
    email_message.send()