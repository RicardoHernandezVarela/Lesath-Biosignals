# Generated by Django 2.1.7 on 2019-05-06 21:38

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('ecg', '0005_auto_20190415_2030'),
    ]

    operations = [
        migrations.AlterField(
            model_name='signal',
            name='categoria',
            field=models.CharField(choices=[('Electrocardiograma', 'Electrocardiograma'), ('Oximetría', 'Oximetría'), ('Electromiograma', 'Electromiograma'), ('Fonocardiograma', 'Fonocardiograma'), ('Electrodérmica', 'Electrodérmica')], max_length=50),
        ),
    ]
