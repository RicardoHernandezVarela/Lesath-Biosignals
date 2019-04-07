from django.db import models
from django.urls import reverse
import datetime

# Modelos para la base de datos.

#Modelo para una bioseñal.

class Signal(models.Model):
    nombre = models.CharField(max_length=255)
    
    CATEGORIAS = {
        ('Electrocardiograma','ECG'),
        ('Electromiograma','EMG'),
        ('Oximetría','OXI'),
        ('Fonocardiograma','FNC'),
        ('Electrodérmica','EDM'),
    }

    categoria = models.CharField(choices=CATEGORIAS, max_length=50)
    fecha = models.DateField(default=datetime.date.today)
    muestras = models.IntegerField(default=0)


