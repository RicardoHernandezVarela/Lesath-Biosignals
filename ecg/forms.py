from django import forms
from django.db import transaction
from django.forms.utils import ValidationError

from ecg.models import Signal

#Formas para crear nuevas instancias de los modelos.

class SignalForm(forms.ModelForm):
    class Meta:
        model = Signal
        fields = ('nombre', 'categoria')