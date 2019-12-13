from django.shortcuts import render
from django.views.generic import CreateView, ListView, UpdateView, DetailView, FormView, DeleteView
from django.shortcuts import get_object_or_404, redirect, render
from django.views.decorators.csrf import csrf_exempt
from django.http import HttpResponse

from django.urls import reverse_lazy, reverse
from ecg.forms import ColaboracionForm
from ecg.models import Colaboracion
from users.models import CustomUser

from ecg.filters import *
from dal import autocomplete

###########################################################
# Ver las colaboraciones del usuario y crear nuevas.
###########################################################
class colaboracion(ListView, FormView):
    context_object_name = 'colaboraciones'
    template_name = 'ecg/colaboraciones/colaboraciones.html'
    model = Colaboracion
    form_class = ColaboracionForm

    def get_queryset(self):
        queryset = self.request.user.colaboracion_set.all()
        return queryset

    def get_form_kwargs(self):
        kwargs = super( colaboracion, self).get_form_kwargs()
        kwargs.update(self.kwargs)  # self.kwargs contains all url conf params
        return kwargs

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['filter'] = ColaboracionFilter(self.request.GET, queryset=self.get_queryset())
        return context

    def form_valid(self, form):
        us = CustomUser.objects.get(username=self.kwargs['username'])
        colaboracion = form.save(commit=False)
        colaboracion.save()
        return redirect('registros:colaboracion', us.username)

###########################################################
# Autocomplete para buscar usuarios y compartir un experimento.
###########################################################
class UserAutocomplete(autocomplete.Select2QuerySetView):
    def get_queryset(self):
        user = self.request.user
        #print(user.username)
        #print(user.is_authenticated)
        if user.is_authenticated == False:
            return CustomUser.objects.none()

        qs = CustomUser.objects.all()

        if self.q:
            #print(self.q)
            qs = qs.filter(username__istartswith=self.q)

        else:
            qs = CustomUser.objects.none()

        return qs

###########################################################
# Crear nueva colaboración. BORRAR
###########################################################
class nueva_colaboracion(CreateView):
    template_name = 'ecg/colaboraciones/colaboracion_form.html'
    form_class = ColaboracionForm
    model = Colaboracion

    def get_form_kwargs(self):
        kwargs = super( nueva_colaboracion, self).get_form_kwargs()
        kwargs.update(self.kwargs)  # self.kwargs contains all url conf params
        return kwargs

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['filter'] = ColaboracionFilter(self.request.GET, queryset=self.get_queryset())
        return context

    def form_valid(self, form):
        us = CustomUser.objects.get(username=self.kwargs['username'])
        colaboracion = form.save(commit=False)
        colaboracion.save()
        return redirect('registros:colaboracion', us.username)
