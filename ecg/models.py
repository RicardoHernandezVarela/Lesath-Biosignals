from django.db import models
from django.urls import reverse
import datetime
from django.apps import apps

from picklefield.fields import PickledObjectField

# Modelos para la base de datos.

#Modelo para una bioseñal.

class Experimento(models.Model):
    usuario = models.ForeignKey('users.CustomUser', on_delete=models.CASCADE, null=True)
    nombre = models.CharField(max_length=255)
    fecha = models.DateField(default=datetime.date.today)
    detalle = models.TextField(max_length=800, blank=True, null=True)

    def __str__(self):
        return self.nombre

class Colaboracion(models.Model):
    experimento = models.ForeignKey(Experimento, on_delete=models.CASCADE)
    colaborador = models.ForeignKey('users.CustomUser', on_delete=models.CASCADE, null=True)

    def __str__(self):
        return str(self.experimento) +  ' - ' + str(self.colaborador)


class Signal(models.Model):
    experimento = models.ForeignKey(Experimento, on_delete=models.CASCADE, null=True)
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
    data = PickledObjectField(default=0)

    """
    def get_absolute_url(self):
        #from django.urls import reverse
        return reverse('registros:señales', args=[str(self.usuario)])
    """
    
    def __str__(self):
        return self.nombre

class Datasenal(models.Model):
    senal = models.ForeignKey(Signal, on_delete=models.CASCADE, null=True)
    muestras = models.IntegerField(default=0)
    data = PickledObjectField(default=0)
    frecuencia = models.IntegerField(default=0)

    def __str__(self):
        return self.senal.nombre

class Descripcion(models.Model):
    senal = models.ForeignKey(Signal, on_delete=models.CASCADE, null=True)
    nombre = models.CharField(max_length=255)
    apellido = models.CharField(max_length=255)
    detalle = models.TextField(max_length=500, blank=True, null=True)

    def __str__(self):
        return self.nombre + self.apellido
