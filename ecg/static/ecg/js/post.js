const guardar = document.getElementById('guardar');
let pathname = window.location.pathname;
let id = pathname.replace('/se%C3%B1ales/nuevoregistro/',''); 
let url = "/señales/info/" + id + "/"

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