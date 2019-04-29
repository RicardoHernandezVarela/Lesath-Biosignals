const scroll = document.getElementById('scroll');
const back = document.getElementById('return');

var ctx = document.getElementById("myChart");

const step = 4000;
let ini = 0;
let final = step - 1;

let tiempo = labels.slice(ini,final);
let sensor = muestras.slice(ini,final);

console.log(categoria);

let min = 0;
let max = 3;
let paso = 1;


if (categoria === 'Electrodérmica') {
    min = 2400;
    max = 2600;
    paso = 10;
}


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
            max: max,
            min: min,
            stepSize: paso
        }
        }]
    },
    legend: {
        display: false,
    }
    }
});

scroll.addEventListener('click', () => {
    console.log('hola');
    
    function addData(chart, label, data) {
        chart.data.labels = label;
        chart.data.datasets.forEach((dataset) => {
            dataset.data = data;
        });
        chart.update();
    }

    ini += step;
    final += step;

    tiempo = labels.slice(ini,final);
    sensor = muestras.slice(ini,final);

    addData(myChart, tiempo, sensor);
});

back.addEventListener('click', () => {
    
    function addData(chart, label, data) {
        chart.data.labels = label;
        chart.data.datasets.forEach((dataset) => {
            dataset.data = data;
        });
        chart.update();
    }

    ini -= step;
    final -= step;

    tiempo = labels.slice(ini,final);
    sensor = muestras.slice(ini,final);

    addData(myChart, tiempo, sensor);
});
