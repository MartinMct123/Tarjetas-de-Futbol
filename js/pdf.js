async function generarPDF(fragment) {

    const hoja = document.createElement("div");
    hoja.id = "hojaTemporal";

    hoja.appendChild(fragment);


    hoja.style.position = "fixed";
    hoja.style.left = "0";
    hoja.style.top = "0";
    hoja.style.opacity = "0";
    hoja.style.pointerEvents = "none";

    document.body.appendChild(hoja);


    // Cargar datos
    hoja.querySelector("#categoria").textContent = persona.categoria;
    hoja.querySelector("#legajo").textContent = persona.legajo;
    hoja.querySelector("#nacionalidad").textContent = persona.nacionalidad;
    hoja.querySelector("#nombre").textContent = persona.nombre;
    hoja.querySelector("#apellido").textContent = persona.apellido;
    hoja.querySelector("#fecha").textContent = persona.nacimiento;
    hoja.querySelector("#dni").textContent = persona.dni;
    hoja.querySelector("#club").textContent = persona.club;

    hoja.querySelector("#fotoTarjeta").src = persona.foto;


    // Esperar imágenes
    const imagenes = hoja.querySelectorAll("img");

    await Promise.all(
        [...imagenes].map(img => {

            if (img.complete && img.naturalWidth > 0) {
                return Promise.resolve();
            }

            return new Promise(resolve => {
                img.onload = resolve;
                img.onerror = resolve;
            });

        })
    );

    const opciones = {
        filename:persona.apellido + " " + persona.nombre + ".pdf",
        margin:0,

        image:{
            type:"jpeg",
            quality:1
        },

        html2canvas:{
            scale:4,
            useCORS:true,
            backgroundColor:"#ffffff"
        },

        jsPDF:{
            unit:"mm",
            format:"a4",
            orientation:"portrait"
        }
    };


    const hojaPDF = hoja.querySelector("#hoja");


    await html2pdf()
        .set(opciones)
        .from(hojaPDF)
        .save();

    hoja.remove();
}