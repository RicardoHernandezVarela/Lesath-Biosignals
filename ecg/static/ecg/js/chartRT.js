var ctx = document.getElementById("realtime");

//let N = 60000; 
//let labels = Array.apply(null, {length: N}).map(Number.call, Number);

let tiempo = 0;
let sensor = 0;

var myChart = new Chart(ctx, {
    type: 'line',
    data: {
    labels: tiempo,
    datasets: [{
        data: sensor,
        lineTension: 0,
        backgroundColor: 'transparent',
        borderColor: '#007bff',
        borderWidth: 1,
        pointRadius: 0,
    }]
    },
    options: {
    scales: {
        yAxes: [{
        ticks: {
            beginAtZero: false,
            max: 700,
            min: 200,
            stepSize: 100
        }
        }]
    },
    legend: {
        display: false,
    }
    }
});

function addData(chart, label, data) {
    chart.data.labels = label;
    chart.data.datasets.forEach((dataset) => {
        dataset.data = data;
    });
    chart.update();
}

function range(start, end) {
    var ans = [];
    for (let i = start; i <= end; i++) {
        ans.push(i);
    }
    return ans;
}

/* Función para obtener los datos que se grafican */
function insertData(datos, inicio, final) {

    tiempo = range(inicio,final);
    sensor = datos.slice(inicio,final);

    addData(myChart, tiempo, sensor);
}