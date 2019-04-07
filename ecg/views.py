from django.shortcuts import render
from ecg.pruebas import hola, ecg, conect_device, registrar_datos

def registros(request):
    return render(request, 'ecg/senales.html')

def nueva_senal(request):
    return render(request, 'ecg/nueva_senal.html')

def holis(request):
    #resultado = hola(pk)
    bpm = ecg()
    return render(request, 'ecg/simple.html', {'valor': bpm})

def conectar(request):
    disponibles = conect_device()
    return render(request, 'ecg/conectar.html', {'puertos': disponibles})

def registrar(request):
    data = registrar_datos()
    labels = list(range(0, len(data)))
    return render(request, 'ecg/registro.html', {'muestra': data, 'labels': labels})
