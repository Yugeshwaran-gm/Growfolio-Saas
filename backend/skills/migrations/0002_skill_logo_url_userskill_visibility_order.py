from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('skills', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='skill',
            name='logo_url',
            field=models.URLField(blank=True),
        ),
        migrations.AddField(
            model_name='userskill',
            name='is_visible',
            field=models.BooleanField(default=True),
        ),
        migrations.AddField(
            model_name='userskill',
            name='sort_order',
            field=models.PositiveIntegerField(default=0),
        ),
    ]
