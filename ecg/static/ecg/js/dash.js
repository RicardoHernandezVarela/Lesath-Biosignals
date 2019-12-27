/********************************************************
 ELEMENTOS DEL DOM PARA IDENTIFICAR CADA SEÑAL POR SU ID
********************************************************/
const id = document.querySelector('#signal-id');
const signalCat = document.querySelector('#signalCat');
const evento = document.querySelector('#evento');
const freq = document.querySelector('#freq');

/* CAMBIAR LA VISTA Y DATOS DE LA SEÑAL */
const vista = document.querySelector('.vista-select');

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
const volts = document.querySelector('.volts');

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
 ELEMENTOS DEL DOM PARA OCULTAR. dash.js
*******************************************************/
try {
    const terminal = document.querySelector('.terminal');
    terminal.style.display = 'none';
} catch (error) {
}

const conectar = document.querySelector('#conectar');
const desconectar = document.querySelector('#desconectar');

/*******************************************************
 OCULTAR ELEMENTOS DEL DOM. dash.js
*******************************************************/
conectar.style.display = 'none';
desconectar.style.display = 'none';

/*******************************************************
 CONTROLAR LA VENTANA MODAL. dash.js
*******************************************************/
close.addEventListener('click', (evt) => {
    modal.style.display = 'none';
});

/*****************************************************
 CAMBIAR CARACTERÍSTICAS SEGÚN EL TIPO DE SEÑAL. dash.js
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
        unidades: 'OX',
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

/**********************************************************
 OBTENER LAS MUESTRAS DE LA SEÑAL DESDE LA BASE DE DATOS. dashData.js
***********************************************************/
var datosSenal = [];
var url = `/senales/descargarData/${id.innerText}/`;

const obtenerSenal = (url) => {

    fetch(url)
        .then(response => response.json())
        .then(data => {
            if(data.length !== 0) {
                datosSenal = data;
                ajustarPlotProps(datosSenal);
            } else {
                modal.style.display = 'block';
            }
            
        })
        .catch(error => console.log('Ocurrio un problema al solicitar los datos', error))
}

obtenerSenal(url);

/***************************************************************
 Ajustar las propiedades de la gráfica después de obtener datos. dashData.js
***************************************************************/
ajustarPlotProps = async (data) => {
    chartSenal.max = Math.ceil(Math.max(...data));
    chartSenal.min = Math.floor(Math.min(...data));
    avance = 20;

    volts.innerText = catProps['default'].unidades;
    hoverUnits = catProps['default'].unidades;

    if(data.length < 1500) {
        clearInterval(ploter);
        chartSenal.series.maxDataPoints = datosSenal.length;
        chartSenal.series[0].color = '#039be5';

        avance = data.length;
        plotData();
        
        hoverUnits = catProps[categoria].unidades;
        volts.innerText = catProps[categoria].unidades;
    }
};

/**********************************************************
 ELEMENTOS DE LA GRAFICA DE LA SEÑAL. dash.js
***********************************************************/
let intervalo = 100;

let chartSenal;
let xAxis;
let y_axis;

let hoverDetail;
let hoverUnits = catProps['default'].unidades;

generarGrafica = () => {
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
    
    y_axis.render();
};

generarGrafica();

/*******************************************************
 AJUSTAR LAS DIMENSIONES DE LA GRÁFICA. dash.js
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
 ACTUALIZAR TIMER. dash.js
******************************************************/
const frecuencia = parseInt(freq.innerText);
var time = 0;

const actualizarTimer = (datos, frecuencia) => {
    time = Math.floor(datos/frecuencia);

    if(datos <= datosSenal.length) {
        timer.innerText = time;
    } else {
        clearInterval(ploter);
    }

};

/******************************************************
 ACTUALIZAR LA GRÁFICA. dash.js
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
 CONTROLAR EL FLUJO DE LA GRÁFICA. dash.js
******************************************************/
let ploting = false;

/* Timer para llamar a la función cada x milisegundos*/
let ploter = setInterval(plotData, intervalo);

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
 SELECCIONAR VISTA Y DATOS DE LA SEÑAL. dashData.js
*******************************************************/
reiniciarChart = (chart, yaxis) => {

    /* Ocultar el señalador del plot anterior */
    hoverDetail.element.style.display = 'none';

    let svgC = chart.getElementsByTagName('svg')[0];
    chart.removeChild(svgC);

    let svgY = yaxis.getElementsByTagName('svg')[0];
    yaxis.removeChild(svgY);

    /* Reiniciar el timer */
    timer.innerText = 0;
    inicio = 0;

    /*Reiniciar estado del plot */
    ploting = false;

    /* Generar los elementos de la nueva gráfica */
    generarGrafica();
};

let filename = signalCat.parentNode.innerText;

vista.addEventListener('change', (event) => {
    let value = event.target.value;
    let url2 = '';

    filename = `${filename} ${value}`;

    if(value !== 'original') {
        url2 = `/senales/${value}/${id.innerText}/`;
        obtenerSenal(url2);
        reiniciarChart(chart, yAxis);
        chartSenal.series[0].color = '#d32f2f';

    } else {
        url2 = url;
        obtenerSenal(url2);
        reiniciarChart(chart, yAxis);
    }
});

/*******************************************************
 DESCARGAR DATOS EN FORMATO CSV. dashData.js
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
    descargarSenal.download = `${filename}.csv`;
    descargarSenal.click();
};

descargar.addEventListener('click', () => {
    download_csv(datosSenal);
});

