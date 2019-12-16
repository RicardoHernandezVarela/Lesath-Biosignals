from django.shortcuts import render
from django.views.generic import CreateView, ListView, UpdateView, DetailView, FormView, DeleteView
from django.shortcuts import get_object_or_404, redirect, render
from django.views.decorators.csrf import csrf_exempt
from django.http import HttpResponse, JsonResponse

from django.urls import reverse_lazy, reverse
from ecg.forms import ExperimentoForm, ColaboracionForm, SignalForm
from ecg.models import Experimento, Signal, Datasenal
from users.models import CustomUser
from ecg.procesamiento import crear_df, crear_np_arr, ecg_bpm, to_int, to_float, to_download, edm_units, rt_bpm, proc_edm

import json

###########################################################
# Ver las señales existentes dentro del experimento.
###########################################################
class senales_exp(ListView, FormView):
    context_object_name = 'senales'
    template_name = 'ecg/senales/senalesExp.html'
    model = Signal
    form_class = SignalForm

    def get_queryset(self):
        experimento = Experimento.objects.get(pk=self.kwargs['pk'])
        #print(experimento.usuario)
        queryset = experimento.signal_set.all()
        return queryset

    def form_valid(self, form):
        experimento = Experimento.objects.get(pk=self.kwargs['pk'])
        print(self.kwargs)
        senal = form.save(commit=False)
        senal.experimento = experimento
        senal.usuario = experimento.usuario
        senal.save()
        return redirect('registros:nueva', senal.pk)
        #return redirect('registros:senalesExp', experimento.pk)

###########################################################
# Tomar una nueva señal / Retomar la señal.
###########################################################
def nueva_senal(request, pk):
    signal = Signal.objects.get(pk=pk)

    return render(request, 'ecg/senales/nueva_senal.html', {'key':pk, 'signal':signal})


############################################################
# Eliminar una señal.
############################################################
class SignalDelete(DeleteView):
    model = Signal

    def get_success_url(self):
        print(self.object)
        exp = self.object.experimento
        return reverse_lazy('registros:senalesExp', kwargs={'pk': exp.pk})

############################################################
# Editar una señal.
############################################################
class SignalUpdate(UpdateView):
    model = Signal
    fields = ['nombre', 'categoria']
    template_name = 'ecg/senales/senalEdit.html'

    def get_success_url(self):
        exp = self.object.experimento

        return reverse_lazy('registros:senalesExp', kwargs={'pk': exp.pk})

############################################################
# Guardar en la base de datos las muestras de la señal.
############################################################
@csrf_exempt
def senal_info(request, pk):
    body_unicode = request.body.decode('utf-8')
    body = json.loads(body_unicode)
    print(body['data'])

    #body = json.loads(request.body)
    senal = body['data']
    freq = body['frecuencia']

    print(len(senal))
    print(freq)

    df = crear_np_arr(senal)

    # Datos de la señal.
    signal = Signal.objects.get(pk=pk) 
    signal.muestras = len(senal)
    signal.frecuencia = freq
    signal.save()
    # Datos de la señal.

    datasets = signal.datasenal_set.all()

    if len(datasets) == 0:
        dataset = Datasenal(senal=signal, muestras=len(senal), data=df, frecuencia=freq)
        dataset.save()
    else:
        dataset = datasets[0]
        dataset.muestras = len(senal)
        dataset.data = df
        dataset.frecuencia = freq
        dataset.save()
    
    return JsonResponse(len(senal), safe=False)

############################################################
# Obtener las muestras de una señal.
############################################################

def descargar_datos(request, pk):
    signal = Signal.objects.get(pk=pk)
    datasets = signal.datasenal_set.all()

    if len(datasets) != 0:
        dataset = datasets[0]
        data = dataset.data #dataset.data[0][0:]
        
        muestras = data.tolist() #to_download(data)
    
    else:
        muestras = []
    
    return JsonResponse(muestras, safe=False)


############################################################
# Dashboard para señales de ECG.
############################################################

def ecg_dash(request, pk):
    signal = Signal.objects.get(pk=pk)

    return render(request, 'ecg/senales/ecg_dash.html', {'signal':signal })

############################################################
# Dashboard para señales de EMG.
############################################################

def emg_dash(request, pk):
    signal = Signal.objects.get(pk=pk)

    return render(request, 'ecg/senales/emg_dash.html', {'signal':signal})

############################################################
# Dashboard para señales de FCG.
############################################################

def fcg_dash(request, pk):
    signal = Signal.objects.get(pk=pk)

    return render(request, 'ecg/senales/fcg_dash.html', {'signal':signal })

############################################################
# Dashboard para señales de EDM.
############################################################

def edm_dash(request, pk):
    signal = Signal.objects.get(pk=pk)

    return render(request, 'ecg/senales/edm_dash.html', {'signal':signal })

