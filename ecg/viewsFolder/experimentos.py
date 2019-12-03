from django.shortcuts import render
from django.views.generic import CreateView, ListView, UpdateView, DetailView, FormView, DeleteView
from django.shortcuts import get_object_or_404, redirect, render
from django.views.decorators.csrf import csrf_exempt
from django.http import HttpResponse

from django.urls import reverse_lazy, reverse
from ecg.forms import ExperimentoForm
from ecg.models import Experimento
from users.models import CustomUser

from ecg.filters import *
from dal import autocomplete

###########################################################
# Ver los experimentos del usuario y crear nuevos
###########################################################

class experimentos(ListView, FormView):
    context_object_name = 'experimentos'
    template_name = 'ecg/experimentos/experimentos.html'
    model = Experimento
    form_class = ExperimentoForm

    def get_queryset(self):
        queryset = self.request.user.experimento_set.all()
        return queryset

    def form_valid(self, form):
        us = CustomUser.objects.get(username=self.kwargs['username'])
        experimento = form.save(commit=False)
        experimento.usuario = us
        experimento.save()
        return redirect('registros:experimentos', experimento.usuario.username)

###########################################################
# Borrar experimento
###########################################################
class borrarExperimento(DeleteView):
    model = Experimento

    def get_success_url(self, **kwargs):
        pk = self.object.pk
        experimento = Experimento.objects.get(pk=pk)
        username = experimento.usuario.username
        return reverse_lazy('registros:experimentos', kwargs={'username': username})

###########################################################
# Editar experimento
###########################################################
class editarExperimento(UpdateView):
    model = Experimento
    fields = ['nombre', 'detalle']
    template_name = 'ecg/experimentos/experimento_edit.html'

    def get_success_url(self, **kwargs):
        pk = self.object.pk
        print(pk)
        experimento = Experimento.objects.get(pk=pk)
        username = experimento.usuario.username
        return reverse_lazy('registros:experimentos', kwargs={'username': username})