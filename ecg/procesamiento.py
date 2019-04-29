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



def ecg_bpm(data):
    import pandas as pd
    import numpy as np
    from scipy.signal import find_peaks
    import matplotlib.pyplot as plt

    ecg_data = data.iloc[:, 0].values #extraer muestras del dataframe, solo columna con valores

    peaks, _ = find_peaks(ecg_data, height=(1, 4), distance=312)
    distancias = np.diff(peaks)

    media = np.mean(distancias)
 
    bpm = (ecg_data.size/media)/(ecg_data.size/37500) #625 por segundo

    """
    plt.figure(1)
    plt.plot(ecg_data)
    plt.plot(peaks, ecg_data[peaks], "x")
    plt.xlabel('tiempo (milisegundos)')
    plt.ylabel('voltaje (mV)')
    plt.title('Electrocardiograma')
    plt.show()
    """
    return int(bpm)

def rt_bpm(data):
    import numpy as np
    from scipy.signal import find_peaks

    ecg_data = np.array(data)

    peaks, _ = find_peaks(ecg_data, height=(1, 4), distance=312)
    distancias = np.diff(peaks)

    media = np.mean(distancias)
 
    bpm = (ecg_data.size/media)/(ecg_data.size/37500) #625 por segundo

    return bpm

def edm_units(data):
    muestras = [2500-(4.6*i) for i in data]
    
    return muestras
