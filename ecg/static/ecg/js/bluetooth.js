/***********************************************************
 ELEMENTOS DEL DOM PARA CONTROLAR LA CONEXIÓN AL BLUETOOTH
***********************************************************/
const conectar = document.querySelector('#conectar');
const desconectar = document.querySelector('#desconectar');
const terminal = document.querySelector('.terminal');

/**********************************************************
 ELEMENTOS DEL DOM PARA CONTROLAR EL BLUETOOTH
**********************************************************/
const play = document.querySelector('#play');
const stop = document.querySelector('#stop');

conectar.addEventListener('click', () => {
    
    requerirDispositivosBT()
        .then(device => conectarConDispositivoBT(device))
        .then(gattserver => conectarConElServicio(gattserver))
        .then(service => obtenerCaracteristicasDelServicio(service))
        .then(characteristics => conectarConCaracteristica(characteristics))
        .then(characteristic => conectarseACambiosDelSensor(characteristic))
        .catch(err => terminal.innerText = "Fallo la conexión")
});

desconectar.addEventListener('click', () => {
    dispositivo.gatt.disconnect();
    terminal.innerText = "Desconectado";
});

/**************************************************************************
 FUNCIONES PARA CONTROLAR LA CONEXIÓN ENTRE EL BLUETOOTH Y EL NAVEGADOR.
 *************************************************************************/

const servicio = 0xFFE0;
var dispositivo = '';
var caracteristica = '';

const separador = '\n';
let dataBuffer = '';

const requerirDispositivosBT = () => {
    /* Desplegar lista de dispositivos BT disponibles y realizar 
    selección de dispositivo para conectar, retorna una promesa 
    con el objeto del dispositivo SELECCIONADO. */ 

    terminal.innerText = "Buscando dispositivos...";

    return (
    navigator.bluetooth.requestDevice({
        // filters: [myFilters]       // filtros o acceptAllDevices
        optionalServices: [servicio],
        acceptAllDevices: true
      })           
    );
};

const conectarConDispositivoBT = (device) => {
    /* Realizar la conexión con el dispositivo BT seleccionado y 
    guardar el dispositivo conectado como un objeto para procesar la
    desconexión entre el navegador y el BT, retorna una promesa con el 
    objeto del dispositivo CONECTADO. */
    
    terminal.innerText = "Conectando con dispositivo...";

    dispositivo = device;
    return device.gatt.connect();
};

const conectarConElServicio = (gattserver) => {
    /* Conectarse al servicio del dispositivo BT a través del servidor 
    gatt para poder enviar y recibir datos, returna una promesa con el
    objeto con la información del servicio al que se conecto el navegador. */

    terminal.innerText = "Conectando con el servicio...";
    
    return gattserver.getPrimaryService(servicio);
};

const obtenerCaracteristicasDelServicio = (service) => {
    /* Obtener la lista de características disponibles en el servicio del 
    dispositivo BT, retorna una promesa con un arreglo que contiene todas
    las características del servicio, en el caso del módulo HM-10 solo hay
    una caracteríastica disponible. */

    terminal.innerText = "Obteniendo características...";

    return service.getCharacteristics();
};

const conectarConCaracteristica = (characteristics) => {
    /* Iniciar las notificaciones en la característica disponible 
    en el servicio del dispositivo BT, retorna una promesa con un 
    objeto que contiene la información de la característica, está
    es la que se modificara para recibir y enviar datos a través 
    del módulo BT. */

    terminal.innerText = "Conectando a característica";

    caracteristica = characteristics[0];
    return caracteristica.startNotifications();
};

const conectarseACambiosDelSensor = (caracteristica) => {
    /* Conectar la característica del modulo BT a la función que procesa los datos que 
    envia el sensor a através del módulo BT */

    terminal.innerText = `Conectado ${dispositivo.name}`;

    caracteristica.oncharacteristicvaluechanged = manejarCambios;
};

/************************************************************************
 FUNCIONES PARA MANEJAR LOS DATOS QUE SE OBTIENEN DEL SENSOR.
 ***********************************************************************/

const manejarCambios = (event) => {
    const valor = new TextDecoder().decode(event.target.value);

    for (const c of valor) {
      if (c === separador) {
        const data = dataBuffer.trim();
        dataBuffer = '';

        if (data !== NaN) {
            recibirDatos(data);
        }

      } else {
        dataBuffer += c;
      }
    }
    
};

/**************************************************************************
 FUNCIONES PARA ENVIAR DATOS AL MICROCONTROLADOR DESDE EL NAVEGADOR.
 *************************************************************************/

// Enviar valores al módulo BLE:
const send = (caracteristica, data) => {
    /* Enviar caracteres al módulo BLE para que las pase al 
    microcontrolador que conecta con el sensor */

    caracteristica.writeValue(new TextEncoder().encode(data));
};

var freqArray = [];

const obtenerFrecuencia = (datos) => {
    if(freqArray.length === 5) {
        clearInterval(checkFreq);
        /* Actualizar frecuencia de muestreo, esta variable 
        es declarada en manejarDatos.js */
        freqReal = freqArray[2] - freqArray[1];
        console.log(freqReal);
    } else {
        freqArray.push(datos);
        console.log(freqReal);
    }
}

var checkFreq;

play.addEventListener('click', () => {
    console.log('play');
    send(caracteristica, 'i');

    if(freqArray.length === 0) {
        checkFreq = setInterval(() => obtenerFrecuencia(datosSensor.length), 1000);
    }
    
});

stop.addEventListener('click', () => {
    console.log('stop');
    send(caracteristica, 'p');
    clearInterval(checkFreq);
    console.log(datosSensor.length);
});

/*******************************************************
 CONTROLAR EL INTERVALO PARA REVISAR LA FRECUENCIA.
*******************************************************/