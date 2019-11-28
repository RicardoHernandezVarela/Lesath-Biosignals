from django.shortcuts import render
from django.views.generic import CreateView, ListView, UpdateView, DetailView, FormView, DeleteView
from django.shortcuts import get_object_or_404, redirect, render
from django.views.decorators.csrf import csrf_exempt
from django.http import HttpResponse

from django.urls import reverse_lazy, reverse
from ecg.forms import ExperimentoForm, ColaboracionForm, SignalForm
from ecg.models import Experimento, Colaboracion, Signal, Descripcion
from users.models import CustomUser
from ecg.pruebas import hola, ecg, conect_device, registrar_datos
from ecg.procesamiento import crear_df, ecg_bpm, to_int, to_float, to_download, edm_units, rt_bpm, proc_edm

from ecg.filters import *
from dal import autocomplete

###########################################################
# Ver las señales existentes dentro del experimento.
###########################################################
class senales_exp(ListView, FormView):
    context_object_name = 'senales'
    template_name = 'ecg/senalesExp.html'
    model = Signal
    form_class = SignalForm

    def get_queryset(self):
        experimento = Experimento.objects.get(pk=self.kwargs['pk'])
        print(experimento.usuario)
        queryset = experimento.signal_set.all()
        return queryset

    def form_valid(self, form):
        experimento = Experimento.objects.get(pk=self.kwargs['pk'])
        print(experimento)
        senal = form.save(commit=False)
        senal.experimento = experimento
        senal.usuario = experimento.usuario
        senal.save()
        return redirect('registros:nueva', senal.pk)
        #return redirect('registros:senalesExp', experimento.pk)