const foto = document.getElementById("foto");
const boton = document.querySelector(".botonFoto");


foto.addEventListener("change", function(){

    if(this.files.length){

        boton.textContent = this.files[0].name;

    }else{

        boton.textContent = "Seleccionar DNI";

    }

});


let persona = {

    categoria: "",
    legajo: "",

    foto: "",
    
    nacionalidad: "",
    nombre: "",
    apellido: "",
    nacimiento: "",
    dni: "",
    club: ""
};


const botonGuardar = document.getElementById("guardar");


botonGuardar.onclick = async function(){

    const fecha = document.getElementById("inputNacimiento").value;

    const [anio, mes, dia] = fecha.split("-");

    const fechaFormateada = `${dia}/${mes}/${anio}`;

    persona.nacionalidad = document.getElementById("inputNacionalidad").value;
    persona.nombre = document.getElementById("inputNombre").value;
    persona.apellido = document.getElementById("inputApellido").value;
    persona.nacimiento = fechaFormateada;
    persona.dni = document.getElementById("inputDNI").value;
    persona.categoria = document.getElementById("inputCategoria").value;
    persona.legajo = document.getElementById("inputLegajo").value;
    persona.club = document.getElementById("inputClub").value;
    persona.foto = document.getElementById("fotoTarjeta").src


    const template = await cargarTemplate();
    const fragment = template.content.cloneNode(true);
    generarPDF(fragment);

};

async function cargarTemplate() {

    const respuesta = await fetch("toPdf/pdf.html");

    const html = await respuesta.text();

    const parser = new DOMParser();

    const doc = parser.parseFromString(html, "text/html");

    return doc.getElementById("tarjetaTemplate");

}


let cropper = null;

const inputFoto = document.getElementById("foto");
const modal = document.getElementById("modalRecorte");
const imagen = document.getElementById("imagenRecortar");

inputFoto.onchange = function(e){

    const archivo = e.target.files[0];

    if(!archivo){
        return;
    }

    const reader = new FileReader();

    reader.onload = function(){

        imagen.src = reader.result;

    };

    reader.readAsDataURL(archivo);

}

imagen.onload = function(){

    modal.style.display = "flex";

    requestAnimationFrame(() => {

        if(cropper){

            cropper.destroy();

        }

        cropper = new Cropper(imagen,{

            aspectRatio:383/451,

            viewMode:2,

            autoCropArea:1,

            movable:true,

            zoomable:true,

            rotatable:false,

            scalable:false,

            responsive:true,

            background:false

        });

    });

}

document.getElementById("aceptarRecorte").onclick = function(){

    const canvas = cropper.getCroppedCanvas({

        width:383,
        height:451

    });

    persona.foto = canvas.toDataURL("image/png");

    document.getElementById("fotoTarjeta").src = persona.foto;

    cropper.destroy();
    cropper = null;

    modal.style.display = "none";

}
document.getElementById("cancelarRecorte").onclick = function(){

    if(cropper){

        cropper.destroy();

        cropper = null;

    }

    modal.style.display = "none";

}