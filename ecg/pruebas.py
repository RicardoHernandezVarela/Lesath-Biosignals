def hola(num):
    return num + 2

def ecg():
    import pandas as pd
    import numpy as np
    import matplotlib.pyplot as plt
    from scipy.signal import find_peaks

    nombre = 'ricardo.csv'
    data = pd.read_csv(nombre, delimiter=",")

    ecg_data = data.iloc[:, 1].values #extraer muestras del dataframe, solo columna con valores

    peaks, _ = find_peaks(ecg_data, distance=150)
    distancias = np.diff(peaks)

    media = np.mean(distancias)
 
    bpm = (ecg_data.size/media)/(ecg_data.size/15000)

    lpm = 'Registrados {} latidos por minuto.'.format(round(bpm))

    return lpm

def conect_device():
    import serial.tools.list_ports
    puertos = [tuple(p) for p in list(serial.tools.list_ports.comports())]
    conectados = []

    for dispositivo in puertos:
        info = {}
        info["puerto"] = dispositivo[0]
        info["dispositivo"] = dispositivo[1]
        conectados.append(info)

    return conectados

def registrar_datos():
    import serial
    import time
    import pandas as pd

    arduino = serial.Serial('com4', 115200)

    data = []

    while len(data) < 100:
        try:
            info = arduino.readline()
            data.append(float(info))

        except ValueError:
            ecg_data = pd.DataFrame(data=data)

        ecg_data = pd.DataFrame(data=data)
        archivo = "data.csv"
        ecg_data.to_csv(archivo)
    
    return data

