const guardar = document.getElementById('guardar');
const enviar = document.getElementById('enviar'); 
const respuesta = document.getElementById('respuesta'); 

let pathname = window.location.pathname;
let id = pathname.replace('/se%C3%B1ales/nuevoregistro/',''); 
let url = "/señales/info/" + id + "/"
let url2 = "/señales/rt/" + id + "/"

guardar.addEventListener('click', () => {
    //console.log(pathname);
    //console.log(id);
    //console.log(url);

    var formData = new FormData();
    formData.append('mediciones', mediciones);

    $.ajax({
        url: url,
        type:'POST',
        data: formData,
        processData: false,
        contentType: false
        
    });
    
    guardar.innerHTML = "Guardado";
    guardar.style.backgroundColor = "#9e9e9e";
    

  });

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