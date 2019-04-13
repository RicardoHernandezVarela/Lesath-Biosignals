// UI elements.
const deviceNameLabel = document.getElementById('device-name');
const connectButton = document.getElementById('connect');
const downloadButton = document.getElementById('download');
const disconnectButton = document.getElementById('disconnect');
const terminalContainer = document.getElementById('terminal');
const sendForm = document.getElementById('send-form');
const inputField = document.getElementById('input');

const start = document.getElementById('start');
const stop = document.getElementById('stop');

// Helpers.
const defaultDeviceName = 'Dispositivo';
const terminalAutoScrollingLimit = terminalContainer.offsetHeight / 2;
let isTerminalAutoScrolling = true;

const scrollElement = (element) => {
  const scrollTop = element.scrollHeight - element.offsetHeight;

  if (scrollTop > 0) {
    element.scrollTop = scrollTop;
  }
};

//Modificar lo que se  muestra en la terminal
const logToTerminal = (message, type = '') => {
  terminalContainer.innerHTML = message;
  /*
  terminalContainer.insertAdjacentHTML('beforeend',
      `<div${type && ` class="${type}"`}>${message}</div>`);

  if (isTerminalAutoScrolling) {
    scrollElement(terminalContainer);
  }*/
};

/****************************
Graficar
*****************************/
/* Rickshaw.js initialization */
var updateInterval = 50;

var chart2 = new Rickshaw.Graph({
    element: document.querySelector("#demo_chart"),
    width: "1000",
    height: "400",
    renderer: "line",
    min: "50",
    max: "700",
    series: new Rickshaw.Series.FixedDuration([{
        name: 'one',
        color: '#446CB3'
    }], undefined, {
        timeInterval: updateInterval,
        maxDataPoints: 3000
    })
});

var y_axis = new Rickshaw.Graph.Axis.Y({
    graph: chart2,
    orientation: 'left',
    tickFormat: Rickshaw.Fixtures.Number.formatKMBT,
    /*tickFormat: function (y) {
        return y.toFixed(2);
    },
    ticks: 5,*/
    element: document.getElementById('y_axis'),
});

var x_ticks = new Rickshaw.Graph.Axis.X( {
    graph: chart2,
    orientation: 'bottom',
    element: document.getElementById('x_axis'),
    pixelsPerTick: 50,
    //tickFormat: Rickshaw.Fixtures.Number.formatKMBT, //format
} );

/* Función para obtener los datos que se grafican */
function insertDatapoints(datos, inicio) {
    for (var i = 0; i < 100; i++) {
        let tmpData = {
            one: datos[inicio + i] // Cambiar para seleccionar ventanas de mediciones.
        };
        
        chart2.series.addData(tmpData);
    }
  
    chart2.render();
}

/****************************
Fin de Grafica
*****************************/

/****************************
Registro de datos a través del BT.
*****************************/
const terminal = new BluetoothTerminal();

let inicio = 0;
var mediciones = [];

terminal.receive = function(data) {
  //logToTerminal(data, 'in');
  mediciones.push(parseInt(data));

  if(mediciones.length % 100 === 0) {
    console.log(mediciones.length);
    insertDatapoints(mediciones, inicio)
    inicio = inicio + 100;
  }
  
};

/****************************
Descargar CSV
*****************************/
downloadButton.addEventListener('click', () => {
  console.log('hola');
        
  function download_csv(data) {
  var csv = 'Muestra\n';
  data.forEach(function(row) {
          csv += row;//.join(',');
          csv += "\n";
  });

  console.log(csv);
  var hiddenElement = document.createElement('a');
  hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(csv);
  hiddenElement.target = '_blank';
  hiddenElement.download = 'Registro.csv';
  hiddenElement.click();
  }

  download_csv(mediciones);
});



// Override default log method to output messages to the terminal and console.
terminal._log = function(...messages) {
  // We can't use `super._log()` here.
  messages.forEach((message) => {
    logToTerminal(message);
    console.log(message); // eslint-disable-line no-console
  });
};

// Implement own send function to log outcoming data to the terminal.
const send = (data) => {
  terminal.send(data).
      then(() => logToTerminal(data, 'out')).
      catch((error) => logToTerminal(error));
};

// Bind event listeners to the UI elements.
connectButton.addEventListener('click', () => {
  terminal.connect().
      then(() => {
        deviceNameLabel.textContent = terminal.getDeviceName() ?
            terminal.getDeviceName() : defaultDeviceName;
      });
});

disconnectButton.addEventListener('click', () => {
  terminal.disconnect();
  deviceNameLabel.textContent = defaultDeviceName;
});

sendForm.addEventListener('submit', (event) => {
  event.preventDefault();

  send(inputField.value);

  inputField.value = '';
  inputField.focus();
});

/*Iniciar registro */
start.addEventListener('click', (event) => {
  event.preventDefault();

  terminal.send(-1);
  console.log(-1);
});

/* Detener registro*/
stop.addEventListener('click', (event) => {
  event.preventDefault();

  terminal.send(-2);
  console.log(-2);
});

// Switch terminal auto scrolling if it scrolls out of bottom.
terminalContainer.addEventListener('scroll', () => {
  const scrollTopOffset = terminalContainer.scrollHeight -
      terminalContainer.offsetHeight - terminalAutoScrollingLimit;

  isTerminalAutoScrolling = (scrollTopOffset < terminalContainer.scrollTop);
});
