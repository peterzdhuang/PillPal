# Generated by Django 4.2.19 on 2025-02-16 03:54

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('pillapp', '0003_alter_user_followers'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='phone',
            field=models.CharField(blank=True, max_length=15, null=True),
        ),
    ]
