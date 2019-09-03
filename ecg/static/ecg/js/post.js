const guardar = document.getElementById('guardar');
const enviar = document.getElementById('enviar');
const respuesta = document.getElementById('respuesta');

const close = document.querySelector('.close')
const modal = document.querySelector('.modal')

let pathname = window.location.pathname;
let id = pathname.replace('/senales/nuevoregistro/','');
let url = "/senales/info/" + id + "/"
let url2 = "/senales/rt/" + id + "/"

close.addEventListener('click', e => {
    modal.style.display = 'none'
})

guardar.addEventListener('click', () => {

    var formData = new FormData();
    formData.append('mediciones', mediciones);
    
    $.ajax({
        url: url,
        type:'POST',
        data: formData,

        success: function (data){
            modal.style.display = 'block'
        },

        processData: false,
        contentType: false

    });

  });


/*Prueba para enviar y procesar datos en tiempo real*/
  enviar.addEventListener('click', () => {
    var muestra = new FormData();
    let lista = [1,2,3,4]
    muestra.append('lista', lista);

    $.ajax({
        url: url2,
        type:'POST',
        data: muestra,

        success: function (data){
            respuesta.innerHTML = data;
        },

        processData: false,
        contentType: false

    });


  });

/*Procesar datos, enviar al servidor y regresar*/
function eventos(datos, inicio, final) {
    let muestra = new FormData();
    let lista = datos.slice(inicio,final);
    muestra.append('lista', lista);

    $.ajax({
        url: url2,
        type:'POST',
        data: muestra,

        success: function (data){
            respuesta.innerHTML = data;

        },

        processData: false,
        contentType: false

    });
}
