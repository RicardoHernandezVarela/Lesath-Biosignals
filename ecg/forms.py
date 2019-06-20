from django import forms
from django.db import transaction
from django.forms.utils import ValidationError

from ecg.models import Signal, Descripcion

#Formas para crear nuevas instancias de los modelos.

class SignalForm(forms.ModelForm):
    class Meta:
        model = Signal
        fields = ('nombre', 'categoria',)

class DescripcionForm(forms.ModelForm):
    class Meta:
        model = Descripcion
        fields = ('senal', 'nombre', 'apellido', 'detalle')