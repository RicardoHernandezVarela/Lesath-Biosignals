/********************************************************
 ELEMENTOS DEL DOM PARA DESCARGAR LOS DATOS QUE SE 
 OBTIENEN EN FORMATO CSV Y GUARDAR EN LA BASE DE DATOS.
********************************************************/
const descargar = document.querySelector('#descargar');
const saveData = document.querySelector('#saveData');

/********************************************************
 ELEMENTO DEL DOM PARA IDENTIFICAR CADA SEÑAL POR SU ID
********************************************************/
const id = document.querySelector('#signal-id');
const signalCat = document.querySelector('#signalCat');
const evento = document.querySelector('#evento');

/********************************************************
 ELEMENTO DEL DOM PARA SELECCIONAR LA FRECUENCIA.
********************************************************/
const muestreo = document.querySelector('#muestreo');

/********************************************************
 ALMACENAR LOS DATOS DEL SENSOR Y ACTUALIZAR LA GRÁFICA
********************************************************/
var datosSensor = [];
let avance = 100;
let inicio = 0;

const recibirDatos = (data) => {
    valor = (parseInt(data)*3.7)/1023;

    datosSensor.push(valor.toPrecision(4));

    /*Graficar*/
    if(datosSensor.length % avance === 0) {
        plotDataRT(datosSensor, inicio, avance);
        inicio += avance;
    }
};

/*******************************************************
DESCARGAR DATOS EN FORMATO CSV.
*******************************************************/
const download_csv = (data) => {
    var csv = 'Muestra\n';

    data.forEach(function(row) {
            csv += row;
            csv += "\n";
    });
  
    var descargarSenal = document.createElement('a');

    descargarSenal.href = 'data:text/csv;charset=utf-8,' + encodeURI(csv);
    descargarSenal.target = '_blank';
    descargarSenal.download = 'Registro.csv';
    descargarSenal.click();
}

descargar.addEventListener('click', () => {
    download_csv(datosSensor);
});

/*****************************************************
 CAMBIAR COLOR SEGÚN EL TIPO DE SEÑAL.
******************************************************/
//console.log(id.innerText, signalCat.innerText);
const categoria = signalCat.innerText;


switch(categoria) {
    case 'Electrocardiograma':
        signalCat.parentNode.style.background = '#d50000';
        evento.innerText = 'BPM';
        break;
    case 'Electromiograma':
        signalCat.parentNode.style.background = '#0288d1';
        evento.innerText = 'ES';
         break;
    case 'Fonocardiograma':
        signalCat.parentNode.style.background = '#00695c';
        evento.innerText = 'BPM';
        break;
    case 'Electrodérmica':
        signalCat.parentNode.style.background = '#ffb300';
        signalCat.parentNode.style.color = '#000';
        evento.innerText = 'EST';
        break;
    case 'Oximetría':
        signalCat.parentNode.style.background = '#fb8c00';
        break;
    default:
        signalCat.parentNode.style.background = '#eeff41';
  }

/*****************************************************
 GUARDAR EN LA BASE DE DATOS LAS MUESTRAS DE LA SEÑAL.
******************************************************/
let frecuencia = muestreo.value;

muestreo.addEventListener('change', (evt) => {
    frecuencia = evt.target.value
    console.log(evt.target.value);
});

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

      body: JSON.stringify({data: datos, frecuencia: freq })
    }

    fetch(`/senales/info/${id.innerText}/`, config)
      .then(checkStatus)
      .then(res => res.json())
      .then(data => console.log(data))
}

saveData.addEventListener('click', () => {
    console.log('save data')
    postData(datosSensor, frecuencia);
});
