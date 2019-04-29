/****************************
Graficar
*****************************/
ancho = document.getElementById("chart").clientWidth;
largo = document.getElementById("chart").clientHeight;
chartWidth = 0.9*ancho;
chartHeigth = 4.1*largo;

/* Rickshaw.js initialization */
var updateInterval = 50;

var chart2 = new Rickshaw.Graph({
    element: document.querySelector("#demo_chart"),
    width: chartWidth,
    height: chartHeigth,
    renderer: "line",
    min: "0",
    max: "4",
    series: new Rickshaw.Series.FixedDuration([{
        name: 'medicion',
        color: '#446CB3'
    }], undefined, {
        timeInterval: updateInterval,
        maxDataPoints: 3000
    })
});

var yAxis = new Rickshaw.Graph.Axis.Y({
    graph: chart2,
    tickFormat: Rickshaw.Fixtures.Number.formatKMBT
});

var xAxis = new Rickshaw.Graph.Axis.X( {
    graph: chart2
} );

var hoverDetail = new Rickshaw.Graph.HoverDetail( {
    graph: chart2,
    xFormatter: function(x) { 
        return x + "milisegundos" 
    },
    yFormatter: function(y) { return Math.floor(y) + " mV" }
} );

/* Función para obtener los datos que se grafican */
function insertDatapoints(datos, inicio, avance) {
    for (var i = 0; i < avance; i++) {
        let tmpData = {
            medicion: datos[inicio + i] // Cambiar para seleccionar ventanas de mediciones.
        };
        
        chart2.series.addData(tmpData);
    }
  
    chart2.render();
    xAxis.render();
    yAxis.render();
}

/****************************
Fin de Grafica
*****************************/