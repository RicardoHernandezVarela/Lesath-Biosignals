/********************************************************
 ELEMENTOS DEL DOM PARA DESCARGAR LOS DATOS QUE SE
 OBTIENEN EN FORMATO CSV Y GUARDAR EN LA BASE DE DATOS.
********************************************************/
const descargar = document.querySelector('#descargar');
const saveData = document.querySelector('#saveData');
const saving = document.querySelector('#saving');

/********************************************************
 ELEMENTO DEL DOM PARA IDENTIFICAR CADA SEÑAL POR SU ID
********************************************************/
const id = document.querySelector('#signal-id');
const signalCat = document.querySelector('#signalCat');
const evento = document.querySelector('#evento');
const volts = document.querySelector('.volts');

/*******************************************************
 ELEMENTOS DEL DOM PARA CONTROLAR LA VENTANA MODAL.
*******************************************************/
const close = document.querySelector('.close');
const modal = document.querySelector('.modal');
const guardada = document.querySelector('#guardada');

/*******************************************************
 ELEMENTOS DEL DOM DEL TIMER.
*******************************************************/
const timer = document.querySelector('.timer-value');

/******************************************************
 ACTUALIZAR TIMER.
******************************************************/
const actualizarTimer = (datos, frecuencia) => {
    let time = Math.floor(datos/frecuencia);

    if(datos <= datosSensor.length) {
        timer.innerText = time;
    }
};

/********************************************************
 ALMACENAR LOS DATOS DEL SENSOR Y ACTUALIZAR LA GRÁFICA
********************************************************/
const sampleECG = [
    1.5, 1.7, 1.8, 1.3, 1.6, 1.5, 1.7, 1.8, 1.3, 1.6, 1.5, 1.7, 1.8, 1.3, 1.6, 1.5, 1.7, 1.8, 1.3, 1.6,
    1.5, 1.7, 1.8, 1.3, 1.6, 1.5, 1.7, 1.8, 1.3, 1.6, 1.5, 1.7, 1.8, 1.3, 1.6, 1.5, 1.7, 1.8, 1.3, 1.6,
];

var datosSensor = [];
let avance = 100;
let inicio = 0;

const recibirDatos = (data) => {
    valor = (parseInt(data)*3.7)/1023;
    
    datosSensor.push(parseFloat(valor.toPrecision(4)));

    /*Graficar*/
    if(datosSensor.length % avance === 0) {
        plotDataRT(datosSensor, inicio, avance);
        inicio += avance;
        actualizarTimer(inicio, freqReal); //freqReal definida en plotRT.js
    }
};

/*******************************************************
 DESCARGAR DATOS EN FORMATO CSV.
*******************************************************/
const filename = signalCat.parentNode.innerText;

const download_csv = (data) => {
    var csv = 'Muestra\n';

    data.forEach(function(row) {
            csv += row;
            csv += "\n";
    });
    
    var descargarSenal = document.createElement('a');

    descargarSenal.href = 'data:text/csv;charset=utf-8,' + encodeURI(csv);
    descargarSenal.target = '_blank';
    descargarSenal.download = `${filename}.csv`;
    descargarSenal.click();
};

descargar.addEventListener('click', () => {
    download_csv(datosSensor);
});

/*****************************************************
 CAMBIAR COLOR SEGÚN EL TIPO DE SEÑAL.
******************************************************/
const catProps = {
    Electrocardiograma:{
        unidades: 'BPM',
        color: '#d50000',
        fuente: '#c2b8b2'
    },
    Electromiograma: {
        unidades: 'ESF',
        color:'#0288d1',
        fuente: '#c2b8b2'
    },
    Fonocardiograma: {
        unidades: 'BPM',
        color: '#00695c',
        fuente: '#c2b8b2'
    },
    Electrodérmica: {
        unidades: 'EST',
        color: '#ffb300',
        fuente: '#c2b8b2'
    },
    Oximetría: {
        unidades: 'OXI',
        color: '#fb8c00',
        fuente: '#000'
    },
    default: {
        unidades: 'Volts',
        color: '#eeff41',
        fuente: '#c2b8b2'
    }
}

const categoria = signalCat.innerText;
signalCat.parentNode.style.background = catProps[categoria].color;
signalCat.parentNode.style.color = catProps[categoria].fuente;
evento.innerText = catProps[categoria].unidades;

volts.innerText = catProps['default'].unidades;

/*****************************************************
 GUARDAR EN LA BASE DE DATOS LAS MUESTRAS DE LA SEÑAL.
******************************************************/

muestreo.addEventListener('change', (evt) => {
    frecuencia = evt.target.value //frecuencia definida en plotRT.js
    console.log(evt.target.value);
});

const senalGuardada = (data) => {
    console.log(data);
    saving.style.display = 'none';
    guardada.innerText = `Señal guardada con ${data} muestras.`;
    modal.style.display = 'block';
}

const checkStatus = (response) => {
    if (response.ok) {
      return Promise.resolve(response);
    } else {
      return Promise.reject(new Error(response.statusText));
    }
}

const postData = (datos, freq) => {

    const config = {
      method: 'POST',
      headers: new Headers({
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'X-Requested-With': 'XMLHttpRequest'
      }),

      body: JSON.stringify({data: datos, frecuencia: freqReal })
    }

    fetch(`/senales/info/${id.innerText}/`, config)
      .then(checkStatus)
      .then(res => res.json())
      .then(data => senalGuardada(data))

}

saveData.addEventListener('click', () => {
    saving.style.display = 'block';
    postData(datosSensor, frecuencia);
});

/*******************************************************
 CONTROLAR LA VENTANA MODAL.
*******************************************************/

close.addEventListener('click', (evt) => {
    modal.style.display = 'none';
});
