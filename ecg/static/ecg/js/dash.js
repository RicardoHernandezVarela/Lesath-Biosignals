/********************************************************
 ELEMENTOS DEL DOM PARA IDENTIFICAR CADA SEÑAL POR SU ID
********************************************************/
const id = document.querySelector('#signal-id');
const signalCat = document.querySelector('#signalCat');
const evento = document.querySelector('#evento');

/*********************************************************
 ELEMENTOS DEL DOM PARA CONTROLAR EL FLUJO DE LA GRÁFICA.
*********************************************************/
const replay = document.getElementById("replay");
const pause = document.getElementById("pause");
const play = document.getElementById("play");

/*******************************************************
 ELEMENTOS DEL DOM PARA CONFIGURAR LA GRÁFICA.
******************************************************/
const yAxis = document.querySelector('#y-axis');
const plotContainer = document.querySelector('.plot');
const chart = document.querySelector("#chart");


/*****************************************************
 CAMBIAR CARACTERÍSTICAS SEGÚN EL TIPO DE SEÑAL.
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
var url = "/senales/descargarData/" + id + "/"
console.log(id.innerText);

const obtenerSenal = () => {

    fetch(`/senales/descargarData/${id.innerText}/`)
        .then(response => response.json())
        .then(data => {
            datosSenal = data;
        })
        .catch(error => console.log('Ocurrio un problema al solicitar los datos', error))
}

obtenerSenal();

/**********************************************************
 ELEMENTOS DE LA GRAFICA DE LA SEÑAL.
***********************************************************/
let intervalo = 100;

var chartSenal = new Rickshaw.Graph({
    element: chart,
    width: plotContainer.offsetWidth * 0.8,
    height: plotContainer.offsetHeight * 0.7,
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
        height: plotContainer.offsetHeight * 0.8
    });
};

window.addEventListener('resize', () => {
    ajustar(chartSenal);
});

/* Ajustar dimensiones de la gráfica */
var anchoAnterior = plotContainer.offsetWidth;

/******************************************************
 ACTUALIZAR LA GRÁFICA.
******************************************************/
let inicio = 0;
let avance = 20;

/* Función para obtener los datos que se grafican */
const plotData = () => {

    replay.addEventListener('click', e => {
        inicio = 0;
    })

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

    chartSenal.render();
}

/******************************************************
 CONTROLAR EL FLUJO DE LA GRÁFICA.
******************************************************/
pause.addEventListener('click', e => {
    clearInterval(ploter);
});

play.addEventListener('click', e => {
    ploter = setInterval(plotData, intervalo);
});

/* Timer para llamar a la función cada x milisegundos*/
var ploter = setInterval(plotData, intervalo);