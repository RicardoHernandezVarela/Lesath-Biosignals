# Generated by Django 2.2.4 on 2019-12-27 05:14

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('ecg', '0023_auto_20191225_2214'),
    ]

    operations = [
        migrations.AlterField(
            model_name='signal',
            name='categoria',
            field=models.CharField(choices=[('Electrodérmica', 'Electrodérmica'), ('Electrocardiograma', 'Electrocardiograma'), ('Oximetría', 'Oximetría'), ('Electromiograma', 'Electromiograma'), ('Fonocardiograma', 'Fonocardiograma')], max_length=50),
        ),
    ]
