/********************************************************
 ELEMENTOS DEL DOM PARA IDENTIFICAR CADA SEÑAL POR SU ID
********************************************************/
const id = document.querySelector('#signal-id');
const signalCat = document.querySelector('#signalCat');
const evento = document.querySelector('#evento');
const freq = document.querySelector('#freq');

/*********************************************************
 ELEMENTOS DEL DOM PARA CONTROLAR EL FLUJO DE LA GRÁFICA.
*********************************************************/
const replay = document.getElementById("replay");
const pause = document.getElementById("pause");
const play = document.getElementById("play");

const timer = document.querySelector('.timer-value');

/*******************************************************
 ELEMENTOS DEL DOM PARA CONFIGURAR LA GRÁFICA.
******************************************************/
const yAxis = document.querySelector('#y-axis');
const plotContainer = document.querySelector('.plot');
const chart = document.querySelector("#chart");

/*******************************************************
 ELEMENTOS DEL DOM PARA CONTROLAR LA VENTANA MODAL.
*******************************************************/
const close = document.querySelector('.close');
const modal = document.querySelector('.modal');

/********************************************************
 ELEMENTOS DEL DOM PARA DESCARGAR LOS DATOS QUE SE 
 OBTIENEN EN FORMATO CSV Y GUARDAR EN LA BASE DE DATOS.
********************************************************/
const descargar = document.querySelector('#descargar');

/*******************************************************
 ELEMENTOS DEL DOM PARA OCULTAR.
*******************************************************/
const terminal = document.querySelector('.terminal');
const conectar = document.querySelector('#conectar');
const desconectar = document.querySelector('#desconectar');

/*******************************************************
 OCULTAR ELEMENTOS DEL DOM.
*******************************************************/
terminal.style.display = 'none';
conectar.style.display = 'none';
desconectar.style.display = 'none';

/*****************************************************
 CAMBIAR CARACTERÍSTICAS SEGÚN EL TIPO DE SEÑAL.
******************************************************/
//console.log(id.innerText, signalCat.innerText);
const categoria = signalCat.innerText;
console.log(signalCat.parentNode.innerText);

switch(categoria) {
    case 'Electrocardiograma':
        signalCat.parentNode.style.background = '#d50000';
        evento.innerText = 'BPM';
        break;
    case 'Electromiograma':
        signalCat.parentNode.style.background = '#0288d1';
        evento.innerText = 'ESF';
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

/**********************************************************
 OBTENER LAS MUESTRAS DE LA SEÑAL DESDE LA BASE DE DATOS.
***********************************************************/
var datosSenal = [];
var url = `/senales/descargarData/${id.innerText}/`;

const obtenerSenal = () => {

    fetch(url)
        .then(response => response.json())
        .then(data => {
            if(data.length !== 0) {
                datosSenal = data;
            } else {
                modal.style.display = 'block';
            }
            
        })
        .catch(error => console.log('Ocurrio un problema al solicitar los datos', error))
}

obtenerSenal(url);

/**********************************************************
 ELEMENTOS DE LA GRAFICA DE LA SEÑAL.
***********************************************************/
let intervalo = 100;

var chartSenal = new Rickshaw.Graph({
    element: chart,
    width: plotContainer.offsetWidth * 0.8,
    height: plotContainer.offsetHeight * 0.85,
    renderer: "line",
    min: "0",
    max: "4",
    series: new Rickshaw.Series.FixedDuration([{
        name: 'data',
        color: '#446CB3'
    }], undefined, 
    {
        timeInterval: intervalo,
        maxDataPoints: 1500
    })
});

var y_axis = new Rickshaw.Graph.Axis.Y({
    graph: chartSenal,
    orientation: 'left',
    tickFormat: function (y) {
        return y.toFixed(2);
    },
    ticks: 5,
    element: yAxis,
});

var hoverDetail = new Rickshaw.Graph.HoverDetail( {
    graph: chartSenal,
    yFormatter: function(y) { return y + "V" }
} );

y_axis.render();

/*******************************************************
 AJUSTAR LAS DIMENSIONES DE LA GRÁFICA.
******************************************************/
const ajustar = (plot) => {
    plot.configure({
        width: plotContainer.offsetWidth * 0.8,
        height: plotContainer.offsetHeight * 0.85
    });
};

window.addEventListener('resize', () => {
    ajustar(chartSenal);
});

/* Ajustar dimensiones de la gráfica */
var anchoAnterior = plotContainer.offsetWidth;

/******************************************************
 ACTUALIZAR TIMER.
******************************************************/
const frecuencia = parseInt(freq.innerText);

const actualizarTimer = (datos, frecuencia) => {
    let time = Math.floor(datos/frecuencia);

    if(datos <= datosSenal.length) {
        timer.innerText = time;
    } else {
        clearInterval(ploter);
    }
};

/******************************************************
 ACTUALIZAR LA GRÁFICA.
******************************************************/
let inicio = 0;
let avance = 20;

/* Función para obtener los datos que se grafican */
const plotData = () => {

    replay.addEventListener('click', e => {
        inicio = 0;
    });

    for (var i = 0; i < avance; i++) {
        let tmpData = {
            data: datosSenal[inicio + i]
        };
        
        chartSenal.series.addData(tmpData);
    }

    inicio += avance;

    let anchoNuevo = plotContainer.offsetWidth;

    if (anchoNuevo !== anchoAnterior) {
        ajustar(chartSenal);
        anchoAnterior = anchoNuevo;
    }

    actualizarTimer(inicio, frecuencia);
    chartSenal.render();
}

/******************************************************
 CONTROLAR EL FLUJO DE LA GRÁFICA.
******************************************************/
var ploting = false;

/* Timer para llamar a la función cada x milisegundos*/
var ploter = setInterval(plotData, intervalo);

pause.addEventListener('click', e => {
    clearInterval(ploter);
    ploting = false;
});

play.addEventListener('click', e => {
    if(!ploting){
        ploter = setInterval(plotData, intervalo);
        ploting = true;
    }
});

replay.addEventListener('click', e => {
    inicio = 0;
    clearInterval(ploter);
    ploter = setInterval(plotData, intervalo);
});

/*******************************************************
 CONTROLAR LA VENTANA MODAL.
*******************************************************/

close.addEventListener('click', (evt) => {
    modal.style.display = 'none';
});

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
    download_csv(datosSenal);
});