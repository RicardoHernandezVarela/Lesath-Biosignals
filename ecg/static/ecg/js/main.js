// UI elements.
const deviceNameLabel = document.getElementById('device-name');
const connectButton = document.getElementById('connect');
const downloadButton = document.getElementById('download');
const reiniciar = document.getElementById('reiniciar');

const disconnectButton = document.getElementById('disconnect');
const terminalContainer = document.getElementById('terminal');
const sendForm = document.getElementById('send-form');
const inputField = document.getElementById('input');

const start = document.getElementById('start');
const stop = document.getElementById('stop');

// Helpers.
const defaultDeviceName = 'Dispositivo';

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
Registro de datos a través del BT.
*****************************/
const terminal = new BluetoothTerminal();

let avance = 300;
let av = 625;
let inicio = 0;
let ini = 0;
let final = inicio + avance-1;
let fin = ini + av-1;
let valor = 0;

let mediciones = [];

terminal.receive = function(data) {
  //logToTerminal(data, 'in');

  if (categoria == 'Electrodérmica') {
    valor = 1 / (1 - (data/1023));
  }
  else {
    valor = (parseInt(data)*3.3)/1023;
  }
  
  
  console.log(valor.toPrecision(4));
  mediciones.push(valor.toPrecision(4));

  if(mediciones.length % avance === 0) {
    //console.log(mediciones.length);
    insertDatapoints(mediciones, inicio, avance);
    eventos(mediciones, inicio, final);
    //insertData(mediciones, inicio, final)
    inicio += avance;
    final += avance-1;
  }

  if (mediciones.length % av === 0) {
    eventos(mediciones, ini, fin);
    ini += av;
    fin += av-1;
  }
  
};

/****************************
Reiciniciar mediciones
*****************************/
/*reiniciar.addEventListener('click', () => {
  mediciones = [];
  terminal.receive();
});*/

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

  terminal.send('i');
  console.log('i');
});

/* Detener registro*/
stop.addEventListener('click', (event) => {
  event.preventDefault();

  terminal.send('p');
  console.log('p');
});

// Switch terminal auto scrolling if it scrolls out of bottom.
terminalContainer.addEventListener('scroll', () => {
  const scrollTopOffset = terminalContainer.scrollHeight -
      terminalContainer.offsetHeight - terminalAutoScrollingLimit;

  isTerminalAutoScrolling = (scrollTopOffset < terminalContainer.scrollTop);
});
