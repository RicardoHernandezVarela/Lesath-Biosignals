/*******************************************************
 ELEMENTOS DEL DOM PARA CONFIGURAR LA GRÁFICA.
******************************************************/

const yAxis = document.querySelector('#y-axis');
const plotContainer = document.querySelector('.plot');
const chart = document.querySelector("#chart");

/*******************************************************
 CONFIGURACIÓN DEL PLOT DE RICKSHAW.JS.
******************************************************/

var plot = new Rickshaw.Graph({
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
        timeInterval: 300,
        maxDataPoints: 500
    })
});

/* Eje Y de la gráfica */

const y_axis = new Rickshaw.Graph.Axis.Y({
    graph: plot,
    orientation: 'left',
    tickFormat: function (y) {
        return y.toFixed(2);
    },
    ticks: 5,
    element: yAxis,
});

/*******************************************************
 AJUSTAR LAS DIMENSIONES DE LA GRÁFICA.
******************************************************/
const ajustar = () => {
    plot.configure({
        width: plotContainer.offsetWidth * 0.8,
        height: plotContainer.offsetHeight * 0.8
    });
};

window.addEventListener('resize', () => {
    ajustar();
});

/* Ajustar dimensiones de la gráfica */
var anchoAnterior = plotContainer.offsetWidth;

/*******************************************************
 ACTUALIZAR LA GRÁFICA - TIEMPO REAL.
******************************************************/

const plotDataRT = (muestras, inicio, avance) => {
    for (let i = 0; i < avance; i++) {
        let tmpData = {
            data: muestras[inicio + i]
        };

        plot.series.addData(tmpData);
    };
    
    let anchoNuevo = plotContainer.offsetWidth;

    if (anchoNuevo !== anchoAnterior) {
        ajustar();
        anchoAnterior = anchoNuevo;
    }

    plot.render();
};

y_axis.render();