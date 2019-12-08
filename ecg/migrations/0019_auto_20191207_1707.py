# Generated by Django 2.1.7 on 2019-12-07 23:07

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('ecg', '0018_auto_20191205_1754'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='signal',
            name='data',
        ),
        migrations.AddField(
            model_name='signal',
            name='frecuencia',
            field=models.IntegerField(default=0),
        ),
        migrations.AlterField(
            model_name='signal',
            name='categoria',
            field=models.CharField(choices=[('Fonocardiograma', 'Fonocardiograma'), ('Electrodérmica', 'Electrodérmica'), ('Electromiograma', 'Electromiograma'), ('Oximetría', 'Oximetría'), ('Electrocardiograma', 'Electrocardiograma')], max_length=50),
        ),
    ]
