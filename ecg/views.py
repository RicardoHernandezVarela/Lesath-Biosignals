from django.shortcuts import render
from django.views.generic import CreateView, ListView, UpdateView, DetailView, FormView
from django.shortcuts import get_object_or_404, redirect, render
from django.views.decorators.csrf import csrf_exempt

from django.urls import reverse_lazy
from ecg.forms import SignalForm
from ecg.models import Signal
from users.models import CustomUser
from ecg.pruebas import hola, ecg, conect_device, registrar_datos
from ecg.procesamiento import crear_csv, ecg_bpm

#Vistas 

def registros(request):
    return render(request, 'ecg/senales.html')

# Ver secciones (unidades) y crear nuevas secciones
#@method_decorator([login_required], name='dispatch')
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

    
def nueva_senal(request, pk):
    return render(request, 'ecg/nueva_senal.html', {'key':pk})

@csrf_exempt
def senal_info(request, pk):
    senal = request.POST.get('mediciones')
    sign = senal.split(',')
    sign = [int(x) for x in sign]
   
    print(type(sign[0]))
    print(len(sign))
    df = crear_csv(sign)

    signal = Signal.objects.get(pk=pk)
    signal.muestras = len(sign)
    signal.data = df
    signal.save()
    return render(request, 'ecg/simple.html', {'key':pk})

def ecg_dash(request, pk):
    signal = Signal.objects.get(pk=pk)
    bpm = ecg_bpm(signal.data)
    return render(request, 'ecg/ecg_dash.html', {'bpm':bpm})


def holis(request):
    resultado = hola(pk)
    bpm = ecg()
    return render(request, 'ecg/simple.html', {'valor': bpm})

def conectar(request):
    disponibles = conect_device()
    return render(request, 'ecg/conectar.html', {'puertos': disponibles})

def registrar(request):
    data = registrar_datos()
    labels = list(range(0, len(data)))
    return render(request, 'ecg/registro.html', {'muestra': data, 'labels': labels})
