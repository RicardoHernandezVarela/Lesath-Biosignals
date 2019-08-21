from django import forms
from django.db import transaction
from django.forms.utils import ValidationError
from django.shortcuts import get_object_or_404
from ecg.models import Experimento, Colaboracion, Signal, Descripcion
from users.models import CustomUser
from dal import autocomplete

#Formas para crear nuevas instancias de los modelos.
class ExperimentoForm(forms.ModelForm):
    class Meta:
        model = Experimento
        fields = ('nombre', 'detalle',)


class ColaboracionForm(forms.ModelForm):
    #experimento = forms.ModelChoiceField(queryset=Experimento.objects.filter(user=self.request.user))
    colaborador = forms.ModelChoiceField(
        queryset = CustomUser.objects.all(),
        widget=autocomplete.ModelSelect2(url='registros:user-autocomplete')
    )

    class Meta:
        model = Colaboracion
        fields = ('experimento', 'colaborador',)

    def __init__(self, username=None, *args, **kwargs):
        super(ColaboracionForm, self).__init__(*args, **kwargs)
        us = get_object_or_404(CustomUser, username=username)
        self.queryset = Experimento.objects.filter(usuario=us)
        self.fields['experimento'].queryset = self.queryset


class SignalForm(forms.ModelForm):
    class Meta:
        model = Signal
        fields = ('nombre', 'categoria',)

class DescripcionForm(forms.ModelForm):
    class Meta:
        model = Descripcion
        fields = ('senal', 'nombre', 'apellido', 'detalle')
