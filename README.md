#  Lesath-Biosignals

![](https://i.ibb.co/7KFLP7b/home.png)

Leath Biosignals es un proyecto desarrollado por un equipo multidiciplinario con el objetivo de generar una plataforma que permitá registrar y análizar bioseñales, a la par de una aplicación web se han desarrollado sensores para registrar señales de:

- Electrocardiograma.
- Fonocardiograma.
- Electromiograma.
- Actividad electrodérmica.

------------
La aplicación web está desarrollada utilizando DJANGO como framework para el backend y la intergaz gráfica con HTML, CSS y Javascript.

Por el momento soy la única persona manteniendo la aplicación pero está abierta para nuevas contribuciones.

------------

**Contenido**

[TOC]

##Intalación
Es necesario contar con python 3.4 o una versión más reciente y pip para poder instalar paquetes, también es recomendable crear un virtual enviroment para poder trabajar con esta aplicación, una vez listo se pueden instalar las dependencias necesarias utilizando el archivo requirements.txt con el siguiente comando.

`$ pip install -r requirements.txt`

Después de instalar las dependencias se requiere crear las migraciones para tener listos los modelos de la aplicación, correr:

`$ python manage.py makemigrations`

`$ python manage.py migrate`

Cuando utilizamos estos comandos es posible trabajar con la base de datos SQLite que está bien para desarrollo, sin embargo por ahora estoy realizando pruebas con PostgreSQL para migrar, cuando se completan las migraciones ya puede correrse la aplicación en el servidor local con:

`$ python manage.py runserver`

##Organización de la información.
La parte central dentro de la aplicación son las señales que los usuarios registrán y almacenan, están organizadas en experimentos dentro de estos los registros corresponden a señales de la misma categoría o que se tomarón bajo las mismas condiciones, estos se pueden compartir con otros usuarios a través de colaboraciones que tienen las mismas características que un experimento.

![](https://i.ibb.co/Y3XZRtQ/exps.png)

A continuación muestro como estan diseñados los modelos.

Para crear un experimento se requiere asignarle un nombre y una breve descripción en detalle, los atributos del usuario y la fecha se asignan automáticamente.

```python
class Experimento(models.Model):
    usuario = models.ForeignKey('users.CustomUser', on_delete=models.CASCADE, null=True)
    nombre = models.CharField(max_length=255)
    fecha = models.DateField(default=datetime.date.today)
    detalle = models.TextField(max_length=800, blank=True, null=True)
```

------------


Una colaboración implica compartir un experimento y todas las señales que contenga con otros usuarios quien también puede crear o eliminar señales dentro de ese experimento, esto es útil cuando un equipo de trabajo realiza la recolección de muestras (señales). El modelo de una colaboración tiene como atributos el experimento que se compartirá y el usuario (colaborador), un experimento puede tener múltiples colaboradores.

```python
class Colaboracion(models.Model):
    experimento = models.ForeignKey(Experimento, on_delete=models.CASCADE)
    colaborador = models.ForeignKey('users.CustomUser', on_delete=models.CASCADE, null=True)
```

------------
El modelo de una señal o registro tiene como atributos el experimento al que pertenece que se asigna automáticamente al igual que el usuario que la creó y la fecha, la categoría a la que pertenece la señal y el nombre son atributos que el usuario debe asignar.

Cuando se crea una señal los atributos de muestras y frecuencia se inician con el valor 0 por defecto, sin embargo se modifica su valor cuando el usuario regitra una señal con un sensor y la guarda en la base de datos.

```python
class Signal(models.Model):
    experimento = models.ForeignKey(Experimento, on_delete=models.CASCADE, null=True)
    usuario = models.ForeignKey('users.CustomUser', on_delete=models.CASCADE, null=True)
    nombre = models.CharField(max_length=255)

    #Revisar cambiar orden. ('ECG', 'Electrocardiograma'),
    CATEGORIAS = {
        ('Electrocardiograma','Electrocardiograma'),
        ('Electromiograma','Electromiograma'),
        ('Oximetría', 'Oximetría'),
        ('Fonocardiograma', 'Fonocardiograma'),
        ('Electrodérmica','Electrodérmica'),
    }

    categoria = models.CharField(choices=CATEGORIAS, max_length=50)
    fecha = models.DateField(default=datetime.date.today)

    muestras = models.IntegerField(default=0)
    frecuencia = models.IntegerField(default=0)
```

------------
La información de una señal está separada de los datos de los registros, estos son todos los valores que registro un sensor durante una medición, cuando un usuario que tomo una señal decide guardarla, automáticamente se asignan los valores a los atributos de este modelo, el atributo data contiene un arreglo (numpy) con las mediciones del sensor, el resto de atributos se utilizán para realizar tareas de procesamiento y análisis de la señal. Al crear una instancia de este modelo los valores de la frecuencia y muestras se asignan también para la instancia correspondiente del modelo Signal. 

```python
class Datasenal(models.Model):
    senal = models.ForeignKey(Signal, on_delete=models.CASCADE, null=True)
    muestras = models.IntegerField(default=0)
    data = PickledObjectField(default=0)
    frecuencia = models.IntegerField(default=0)
```

------------

El procesamiento de las señales y la información disponible depende de la categoría a la que pertenece (electrocardiograma, fonocardiograma, electromiograma o actividad electrodérmica), por ello existe un modelo para cada una que contiene atributos específicos. Por el momento está disponible el procesamiento y análisis de señales de electrocardiograma.


```python
class Descripcionecg(models.Model):
    senal = models.ForeignKey(Signal, on_delete=models.CASCADE, null=True)
    filtrada = PickledObjectField(default=0)
    hrv = PickledObjectField(default=0)
    bpm = models.IntegerField(default=0)
```
Las instancias de este modelo se crean cuando el usuario abre por primera vez el registro de está señal, cuando esto sucede se procesa la información de la señal y los resultados se almacenan en el atributo correspondiente, para el caso de electrocardiogramas se obtiene la señal filtrada, la variabilidad del ritmo cardiaco y los latidos por minuto durante todo el registro de la señal.

![](https://i.ibb.co/XS422sr/ecgs.png)

------------

Las operaciones CRUD se han implementado para las  instancias de los modelos de experimentos, colaboraciones y señales. Si se elimina un experimento sucede lo mismo con las colaboraciones y señales que estén asociadas a él, al eliminar una señal también todos los datos asociados se eliminan de la base de datos.

##Registro de una señal.
La conexión entre los sensores y la aplicación se realiza a través de Bluetooth, la adquisición de las señales se basa en el API de chrome.bluetooth para conectar dispositivos bluetooth al navegador, de esta forma utilizando sensores conectados a un microcontrolador es posible enviar los datos al navegador.

```javascript
const requerirDispositivosBT = () => {
    /* Desplegar lista de dispositivos BT disponibles y realizar 
    selección de dispositivo para conectar, retorna una promesa 
    con el objeto del dispositivo SELECCIONADO. */ 

    terminal.innerText = "Buscando dispositivos...";

    /* Revisar si navigator.bluetooth está disponible */

    if(navigator.bluetooth !== undefined){
        return (
            navigator.bluetooth.requestDevice({
                // filters: [myFilters]       // filtros o acceptAllDevices
                optionalServices: [servicio],
                acceptAllDevices: true
            })          
        );
    } else {
        alert('Conexión bluetooth no disponible en este dispositivo o navegador.');
        return Promise.reject();
    }
};
```
El proceso de conexión está implementado utilizando promesas.

```javascript
conectar.addEventListener('click', () => {
    
    requerirDispositivosBT()
        .then(device => conectarConDispositivoBT(device))
        .then(gattserver => conectarConElServicio(gattserver))
        .then(service => obtenerCaracteristicasDelServicio(service))
        .then(characteristics => conectarConCaracteristica(characteristics))
        .then(characteristic => conectarseACambiosDelSensor(characteristic))
        .catch(err => terminal.innerText = "Falló la conexión")
});
```
Las pruebas fuerón realizadas con el microcontrolador ATMEGA328P disponible en el Arduino UNO y el BLE HM-10 CC2541, la aplicación utiliza por defecto el servicio 0xFFE0 para leer los valores de los sensores, el script para realizar la conexión entre el microcontrolador y el módulo Bluetooth y poder transmitir datos de un sensor está disponible en otro de mis repositorios con el nombre de [arduino-HM10](https://github.com/RicardoHernandezVarela/arduino-HM10 "arduino-HM10")

Para realizar la conexión es necesario que el ususario la habilite haciendo click en el icono del bluetooth, esto despliega una ventana que muestra los dispositvos disponibles para conectarse, después de seleccionar el dispositivo y hacer click en vincular se realiza la conexión entre el navegador y el dispositivo bluetooth, este proceso puede revisarse de forma simplificada en otro de mis repositorios que se encuentra con el nombre de [webBT](https://github.com/RicardoHernandezVarela/webBT "webBT")

![](https://i.ibb.co/ZJtRyY6/blue.png)

##Visualización de los datos de una señal.
Para la visualización he utilizado la librería Rickshaw.js implementando visualización en "tiempo real" de los datos que se registran del sensor conectado. 

![](https://i.ibb.co/8MhgqKc/raw.png)

La librería implementa  una gráfica y sus componentes (ejes y detalles) como clases, y se crea como una instancia con un objeto que define las características de cada componente de la gráfica.

```javascript
    chartSenal = new Rickshaw.Graph({
        element: chart,
        width: plotContainer.offsetWidth * 0.8,
        height: plotContainer.offsetHeight * 0.85,
        renderer: "line",
        min: '0',
        max: '4',
        series: new Rickshaw.Series.FixedDuration([{
            name: 'data',
            color: '#0d47a1'
        }], undefined, 
        {
            timeBase: 0,
            timeInterval: 1000, //milisegundos
            maxDataPoints: 1500
        })
    });
    
    xAxis = new Rickshaw.Graph.Axis.X( {
        graph: chartSenal,
        ticks: 3,
        tickFormat: (x) => {
            let secs = Math.floor(x/frecuencia);
            
            if(secs < 0) {
                return 0
            } else {
                return secs
            }
        }
    });

    y_axis = new Rickshaw.Graph.Axis.Y({
        graph: chartSenal,
        orientation: 'left',
        ticks: 5,
        element: yAxis,
    });

    hoverDetail = new Rickshaw.Graph.HoverDetail( {
        graph: chartSenal,
        formatter: (timer, x, y) => {
            let secs = Math.floor(x/frecuencia);
            return y.toFixed(2) + ' ' + hoverUnits + '<br>' + secs + ' sec'
        }
    });
```

Para poder visualizar los datos que se obtienen de un sensor se actualiza la gráfica, esto se logra definiendo un intervalo de tiempo para llamar a la función que inserta nuevos datos y hace el render de la gráfica.

```javascript
const plotData = () => {
	
    for (let i = 0; i < avance; i++) {
        let tmpData = {
            data: datosSenal[inicio + i]
        };
        
        chartSenal.series.addData(tmpData);
    }

    inicio += avance;

    chartSenal.render();
}

let ploter = setInterval(plotData, intervalo);
```


------------


##Procesamiento y análisis disponibles.
Este proyecto integra las herramientas de procesamiento de bioseñales de la libreria [BioSppy](https://biosppy.readthedocs.io/en/stable/biosppy.signals.html#biosppy-signals-ecg "BioSppy") para python, por el momento está disponible el procesamiento de electrocardiogramas para obtener la señal filtrada, determinar los latidos por mínuto y la variabilidad de la frecuencia cardiaca.

Esta librería tiene multiples funciones para procesar y obtener información de una señal, para señales de electrocardiogramas he utilizado la siguiente que retorna la señal filtrada y la variabilidad de la frecuencia cardiaca. El argumento show genera gráficas con matplotlib, sin embargo la aplicación no requiere estas graficás por ello su valor es False, el sampling_rate es la frecuencia a la que se tomó la señal.

 `ecg.ecg(signal=signal, sampling_rate=1000., show=True)`
 
 Esta función se ejecuta una sola vez cuando el usuario visualiza por primera vez la señal guardada.
 
 ```python
from biosppy.signals import ecg

info = signal.datasenal_set.all()[0]
proces = ecg.ecg(signal=info.data, sampling_rate=info.frecuencia, show=False)

hrate = proces[6]
bpm = int(sum(hrate) / len(hrate))

descripcion = Descripcionecg(senal=signal, filtrada=proces[1], hrv=proces[6], bpm=bpm)
descripcion.save()
print(descripcion.bpm)
```
Los latidos por minuto de la señal se determinan como el promedio durante el registro de la señal.

```python
bpm = int(sum(hrate) / len(hrate))
```

------------

 - Señal filtrada.
 ![](https://i.ibb.co/d775wcc/filt.png)
 
 - Variabilidad de la frecuencia cardiaca.
 ![](https://i.ibb.co/2WnD0gJ/hrv.png)
 
![](https://i.ibb.co/b2pQ98v/logo.png)

