var bluetooth = document.querySelector('button.bluetooth');

bluetooth.addEventListener('click', () => {
    navigator.bluetooth.requestDevice({
        filters: [{ name: 'BITalino BLE' }]
        })
        .then(function(device) {
          // Step 2: Connect to it
          return device.gatt.connect();
          document.write(device.gatt.connect());
        });                 
  });