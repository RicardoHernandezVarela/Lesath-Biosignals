def crear_csv(data):
    import pandas as pd

    signal_data = pd.DataFrame(data=data)
    #archivo = "data.csv"
    #signal_data.to_csv(archivo)

    return signal_data

def ecg_bpm(data):
    import pandas as pd
    import numpy as np
    from scipy.signal import find_peaks

    ecg_data = data.iloc[:, 0].values #extraer muestras del dataframe, solo columna con valores

    peaks, _ = find_peaks(ecg_data, distance=150)
    distancias = np.diff(peaks)

    media = np.mean(distancias)
 
    bpm = (ecg_data.size/media)/(ecg_data.size/60000)

    return bpm