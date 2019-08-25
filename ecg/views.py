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
from ecg.procesamiento import crear_df, ecg_bpm, to_int, to_float, edm_units, rt_bpm, proc_edm

from ecg.filters import *
from dal import autocomplete

#Vistas

def registros(request):
    return render(request, 'ecg/senales.html')

# Ver secciones (unidades) y crear nuevas secciones
#@method_decorator([login_required], name='dispatch')
class experimentos(ListView, FormView):
    context_object_name = 'experimentos'
    template_name = 'ecg/experimentos.html'
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

class colaboracion(ListView):
    context_object_name = 'colaboraciones'
    template_name = 'ecg/colaboraciones.html'
    model = Colaboracion
    form_class = ColaboracionForm

    def get_queryset(self):
        queryset = self.request.user.colaboracion_set.all()
        return queryset

class UserAutocomplete(autocomplete.Select2QuerySetView):
    def get_queryset(self):
        user = self.request.user
        #print(user.username)
        #print(user.is_authenticated)
        # Don't forget to filter out results depending on the visitor !
        if user.is_authenticated == False:
            return CustomUser.objects.none()

        qs = CustomUser.objects.all()

        if self.q:
            #print(self.q)
            qs = qs.filter(username__istartswith=self.q)

        else:
            qs = CustomUser.objects.none()

        return qs

class nueva_colaboracion(CreateView):
    template_name = 'ecg/colaboracion_form.html'
    form_class = ColaboracionForm
    model = Colaboracion

    def get_form_kwargs(self):
        kwargs = super( nueva_colaboracion, self).get_form_kwargs()
        # update the kwargs for the form init method with yours
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

class ver_registros(ListView, FormView):
    context_object_name = 'signals'
    template_name = 'ecg/senales.html'
    model = Signal
    form_class = SignalForm

    def get_queryset(self):
        queryset = self.request.user.signal_set.all()
        return queryset

    def form_valid(self, form):
        us = CustomUser.objects.get(username=self.kwargs['username'])
        signal = form.save(commit=False)
        signal.usuario = us
        signal.save()
        return redirect('registros:nueva', signal.pk)

class SignalDelete(DeleteView):
    model = Signal

    def get_success_url(self):
        exp = self.object.experimento

        return reverse_lazy('registros:senalesExp', kwargs={'pk': exp.pk})

class SignalUpdate(UpdateView):
    model = Signal
    fields = ['nombre', 'categoria']
    template_name = 'ecg/editSignal_form.html'

    def get_success_url(self):
        exp = self.object.experimento

        return reverse_lazy('registros:senalesExp', kwargs={'pk': exp.pk})
        

def nueva_senal(request, pk):
    signal = Signal.objects.get(pk=pk)
    categoria = signal.categoria

    return render(request, 'ecg/nueva_senal.html', {'key':pk, 'signal':signal, 'categoria': categoria})

@csrf_exempt
def senal_info(request, pk):
    senal = request.POST.get('mediciones')
    sign = senal.split(',')
    sign = [float(x) for x in sign]

    print(type(sign[0]))
    print(len(sign))
    df = crear_df(sign)

    signal = Signal.objects.get(pk=pk)
    signal.muestras = len(sign)
    signal.data = df
    signal.save()
    return render(request, 'ecg/simple.html', {'key':pk})

#Vista para procesar los dato en tiempo real
@csrf_exempt
def rt_info(request, pk):
    senal = request.POST.get('lista')
    sign = senal.split(',')
    sign = [float(x) for x in sign]

    respuesta = 0

    signal = Signal.objects.get(pk=pk)
    if signal.categoria == 'Electromiograma':
        respuesta = max(sign)
    elif signal.categoria == 'Electrodérmica':
        respuesta = max(sign)
    else:
        respuesta = rt_bpm(sign)

    return HttpResponse(respuesta)

def ecg_dash(request, pk):
    signal = Signal.objects.get(pk=pk)
    data = signal.data[0][0:]
    muestras = to_float(data)
    bpm = ecg_bpm(signal.data)
    condicion = ''
    if bpm < 50:
        condicion = 'Bradicardia'
    elif bpm > 100:
        condicion = 'Taquicardia'
    else:
        condicion = 'Normal'

    labels = list(range(0, len(muestras)))
    return render(request, 'ecg/ecg_dash.html', {'signal':signal, 'bpm':bpm, 'data':muestras, 'labels': labels, 'condicion':condicion})

def fcg_dash(request, pk):
    signal = Signal.objects.get(pk=pk)
    data = signal.data[0][0:]
    muestras = to_float(data)
    bpm = ecg_bpm(signal.data)
    condicion = ''
    if bpm < 50:
        condicion = 'Bradicardia'
    elif bpm > 100:
        condicion = 'Taquicardia'
    else:
        condicion = 'Normal'

    labels = list(range(0, len(muestras)))
    return render(request, 'ecg/fcg_dash.html', {'signal':signal, 'bpm':bpm, 'data':muestras, 'labels': labels, 'condicion':condicion})

def edm_dash(request, pk):
    signal = Signal.objects.get(pk=pk)
    data = signal.data [0][0:]
    muestras = to_float(data)
    muestras = edm_units(muestras)
    res = proc_edm(muestras)

    labels = list(range(0, len(muestras)))
    return render(request, 'ecg/edm_dash.html', {'signal':signal, 'data':muestras, 'labels': labels, 'res':res})

def emg_dash(request, pk):
    signal = Signal.objects.get(pk=pk)
    data = signal.data[0][0:]
    muestras = to_float(data)

    labels = list(range(0, len(muestras)))
    return render(request, 'ecg/emg_dash.html', {'signal':signal, 'data':muestras, 'labels': labels})
