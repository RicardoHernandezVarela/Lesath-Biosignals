/****************************
Graficar
*****************************/
const replay = document.getElementById("replay");
const pause = document.getElementById("pause");
const play = document.getElementById("play");

const nombreSenal = document.querySelector('.nombreSenal');
const nombreArchivo = nombreSenal.innerHTML;

const descargar = document.getElementById("descargar");

var path = pathname = window.location.pathname;
path_arr = path.split('/');

var id = path_arr[3];
var url = "/senales/descargarData/" + id + "/"

var anchura = document.getElementById("chartContainer").clientWidth;
var altura = document.getElementById("chartContainer").clientHeight;

function adjustWindowSize() {
    anchura = document.getElementById("chartContainer").clientWidth;
    altura = document.getElementById("chartContainer").clientHeight;

    chartSenal.width = 1*anchura;
    chartSenal.height = 0.9*altura;
}
  
window.onresize = adjustWindowSize;

var updateSenal = 100;

/* Rickshaw.js initialization */
var chartSenal = new Rickshaw.Graph({
    element: document.querySelector("#chart"),
    width: 1*anchura,
    height: 0.9*altura,
    renderer: "line",
    min: "0",
    max: "4",
    series: new Rickshaw.Series.FixedDuration([{
        name: 'señal',
        color: '#446CB3'
    }], undefined, {
        timeInterval: updateSenal,
        maxDataPoints: 3 * anchura
    })
});

var yAxis = new Rickshaw.Graph.Axis.Y({
    graph: chartSenal,
    tickFormat: Rickshaw.Fixtures.Number.formatKMBT
});

var time = new Rickshaw.Fixtures.Time();
var seconds = time.unit('seconds');

var xAxis = new Rickshaw.Graph.Axis.Time({
    graph: chartSenal,
    timeUnit: seconds
});

var hoverDetail = new Rickshaw.Graph.HoverDetail( {
    graph: chartSenal,
    xFormatter: function(x) { 
        return x/1000 + "ms" 
    },
    yFormatter: function(y) { return y + "V" }
} );


var inic = 0;
/* Timer para llamar a la función cada x milisegundos*/
var ploter = setInterval(insertRandomDatapoints, updateSenal);

/* Función para obtener los datos que se grafican */
function insertRandomDatapoints() {

    replay.addEventListener('click', e => {
        inic = 0;
    })

    for (var i = 0; i < 20; i++) {
        let tmpData = {
            señal: muestras[inic + i] // Cambiar para seleccionar ventanas de mediciones.
        };
        
        chartSenal.series.addData(tmpData);
    }

    inic = inic + 20;
    chartSenal.render();
}

pause.addEventListener('click', e => {
    clearInterval(ploter);
})

play.addEventListener('click', e => {
    ploter = setInterval(insertRandomDatapoints, updateSenal);
})

function download_csv(data) {
    var csv = 'Muestra\n';
    
    data.forEach(function(row) {
            csv += row;//.join(',');
            csv += "\n";
    });
  
    var hiddenElement = document.createElement('a');
    hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(csv);
    hiddenElement.target = '_blank';
    hiddenElement.download = nombreArchivo + '.csv';
    hiddenElement.click();
}

/* DESCARGAR DATA*/

descargar.addEventListener('click', e => {

    $.ajax({
        url: url,
        type:'GET',
        //data: muestra,

        success: function (data){
            
            let muestras = data.split(",");
            download_csv(muestras);

        },

        processData: false,
        contentType: false

    });

})