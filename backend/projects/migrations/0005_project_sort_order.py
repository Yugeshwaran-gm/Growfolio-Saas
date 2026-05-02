from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('projects', '0004_project_tech_stack'),
    ]

    operations = [
        migrations.AddField(
            model_name='project',
            name='sort_order',
            field=models.PositiveIntegerField(default=0),
        ),
    ]
