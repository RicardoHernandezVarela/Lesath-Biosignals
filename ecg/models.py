from django.db import models
from django.urls import reverse
import datetime
from django.apps import apps
#MyModel1 = apps.get_model('app1', 'MyModel1')

# Modelos para la base de datos.

#Modelo para una bioseñal.

class Signal(models.Model):
    usuario = models.ForeignKey('users.CustomUser', on_delete=models.CASCADE, null=True)
    nombre = models.CharField(max_length=255)
    
    #Revisar cambiar orden. ('ECG', 'Electrocardiograma'),
    CATEGORIAS = {
        ('Electrocardiograma','Electrocardiograma'),
        ('Electromiograma','Electromiograma'),
        ('Oximetría', 'Oximetría'),
        ('Fonocardiograma', 'Fonocardiograma'),
        ('Electrodérmica','Electrodérmica'),
    }

    categoria = models.CharField(choices=CATEGORIAS, max_length=50)
    fecha = models.DateField(default=datetime.date.today)
    muestras = models.IntegerField(default=0)

    def __str__(self):
        return self.nombre


