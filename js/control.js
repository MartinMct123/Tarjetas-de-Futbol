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

    persona.nacimiento = fechaFormateada;
    persona.categoria = document.getElementById("inputCategoria").value;
    persona.legajo = document.getElementById("inputLegajo").value;
    persona.club = document.getElementById("inputClub").value;
    console.log(persona);
    const template = await cargarTemplate();
    const fragment = template.content.cloneNode(true);
    generarPDF(fragment);

};



const archivo = document.getElementById("foto");
const imagenOCR = document.getElementById("imagenDNI");

archivo.onchange = function(){

    const file = this.files[0];

    if(!file) return;

    imagenOCR.src = URL.createObjectURL(file);

};

imagenOCR.onload = function(){
    escanearDNI(imagenOCR);
};

async function cargarTemplate() {

    const respuesta = await fetch("../toPdf/pdf.html");

    const html = await respuesta.text();

    const parser = new DOMParser();

    const doc = parser.parseFromString(html, "text/html");

    return doc.getElementById("tarjetaTemplate");

}