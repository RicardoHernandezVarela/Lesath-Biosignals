from ecg.models import Experimento, Colaboracion, Signal, Descripcion, Datasenal

def crear_df(data):
    import pandas as pd

    signal_data = pd.DataFrame(data=data)
    #archivo = "data.csv"
    #signal_data.to_csv(archivo)

    return signal_data

def to_int(data):

    enteros = []
    for num in data:
        enteros.append(int(num))

    return enteros

def to_float(data):

    numeros = []
    for num in data:
        numeros.append(float(num))

    return numeros

def to_download(data):

    numeros = []
    for num in data:
        numeros.append(float(num))

    return numeros


def ecg_bpm(ecg_data, frecuencia):
    import numpy as np
    from scipy.signal import find_peaks

    peaks, _ = find_peaks(ecg_data, height=(2, 4), distance=frecuencia/2)
    distancias = np.diff(peaks)

    media = np.mean(distancias)

    bpm = (ecg_data.size/media)/(ecg_data.size/(frecuencia*60)) #625 por segundo

    return int(bpm)

def rt_bpm(data):
    import numpy as np
    from scipy.signal import find_peaks

    ecg_data = np.array(data)

    peaks, _ = find_peaks(ecg_data, height=(1, 4), distance=235)
    distancias = np.diff(peaks)

    media = np.mean(distancias)

    bpm = (ecg_data.size/media)/(ecg_data.size/35280) #588 por segundo

    return int(bpm)

def edm_units(data):
    muestras = [round((i*1023)/3.7) for i in data]
    muestras = [round(1/(1-i/1023), 3) for i in muestras]

    return muestras

def proc_edm(data):
    import statistics as st
    import math
    media = st.mean(data)
    sd = st.stdev(data)
    lcl = media - 2.58 * sd/math.sqrt(len(data))
    ucl = media + 2.58 * sd/math.sqrt(len(data))

    estres = 0
    relajado = 0

    for i in data:
        if i > ucl:
            estres += 1
        elif i < lcl:
            relajado += 1

    resultado = ''

    if estres > relajado:
        resultado = 'Estresado'
    elif relajado > estres:
        resultado = 'Relajado'

    return resultado

def crear_np_arr(data):
    import numpy as np

    signal = np.around(data, decimals=3)

    return signal

def generar_senal(filename, senalEnd, frecuencia):
    import csv

    dataSenal = []

    with open(filename) as csvDataFile:
        csvReader = csv.reader(csvDataFile)
        for row in csvReader:
            dataSenal.append(float(row[1]))

    df = crear_np_arr(dataSenal)

    senalEnd.muestras = len(dataSenal)
    senalEnd.frecuencia = frecuencia
    senalEnd.save()

    dataset = Datasenal(senal=senalEnd, muestras=len(dataSenal), data=df, frecuencia=frecuencia)
    dataset.save()

