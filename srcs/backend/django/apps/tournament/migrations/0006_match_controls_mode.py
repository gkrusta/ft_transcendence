# Generated by Django 4.2 on 2024-08-29 13:15

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('tournament', '0005_rename_player_1_score_match_loser_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='match',
            name='controls_mode',
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
    ]
