const scroll = document.getElementById('scroll');
const back = document.getElementById('return');

var ctx = document.getElementById("myChart");

const step = 4000;
let inic = 0;
let fin = step - 1;

let fs = 588;

let tiempo = labels.slice(inic,fin);
let sensor = muestras.slice(inic,fin);

console.log(categoria);

let max = Math.max(...muestras) + 0.1;

if (max > 4) {
    max = 3.7; 
}

let min = Math.min(...muestras) - 0.1;
let paso = 0.2;

console.log(max)
console.log(min)

let ejeX = 'Voltaje';

if (categoria === 'Electrodérmica') {
    ejeX = 'µS';
}

var myChart = new Chart(ctx, {
    type: 'line',
    data: {
    labels: tiempo,
    datasets: [{
        label:'Señal',
        data: sensor,
        lineTension: 0,
        backgroundColor: 'transparent',
        borderColor: '#007bff',
        borderWidth: 1,
        pointRadius: 0,
    }]
    },
    options: {
        responsive: true,
    scales: {
        xAxes: [{
            display: true,
            scaleLabel: {
                display: true,
                labelString: 'Muestras'
            }
        }],
        yAxes: [{
            scaleLabel: {
                display: true,
                labelString: ejeX
            },
        ticks: {
            beginAtZero: false,
            max: max,
            min: min,
            stepSize: paso
        }
        }]
    },
    legend: {
        display: true,
        text: 'ECG'
    }
    }
});

scroll.addEventListener('click', () => {
    
    function addData(chart, label, data) {
        chart.data.labels = label;
        chart.data.datasets.forEach((dataset) => {
            dataset.data = data;
        });
        chart.update();
    }

    console.log(fin);
    inic += step;
    fin += step;

    tiempo = labels.slice(inic,fin);
    sensor = muestras.slice(inic,fin);

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
    console.log(fin)
    inic -= step;
    fin -= step;

    tiempo = labels.slice(inic,fin);
    sensor = muestras.slice(inic,fin);

    addData(myChart, tiempo, sensor);
});
