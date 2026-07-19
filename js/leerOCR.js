async function leerOCR(imagen){

    if(imagen instanceof cv.Mat){

        imagen = matACanvas(imagen);

    }


    let resultado = await Tesseract.recognize(
        imagen,
        "spa",
        {
            tessedit_pageseg_mode: 7
        }
    );

    return resultado.data.text;

}

function matACanvas(mat){

    let canvas = document.createElement("canvas");

    canvas.width = mat.cols;
    canvas.height = mat.rows;


    cv.imshow(
        canvas,
        mat
    );


    return canvas;

}


function limpiarNombre(texto){

    texto = texto
        .replace(/Nombre\s*\/\s*Name/gi, "")
        .replace(/\n+/g, " ")
        .trim();

    return texto;

}

function limpiarApellido(texto){

    texto = texto
        .replace(/Apellido\s*\/\s*Surname/gi, "")
        .replace(/Apelido\s*\/\s*Surname/gi, "")
        .replace(/\n+/g, " ")
        .trim();

    return texto;

}

function limpiarNacionalidad(texto){

    texto = texto
        .replace(/Nacionalidad\s*\/\s*Nationality/gi, "")
        .replace(/\n+/g, " ")
        .trim();

    return texto;

}


async function ejecutarOCR(zonas){

    let personaNacionalidad = await leerOCR(
        zonas.nacionalidad
    );

    texto = limpiarNacionalidad(personaNacionalidad);

    let personaNombre = await leerOCR(
        zonas.nombre
    );

    texto = limpiarNombre(personaNombre);

    let personaApellido = await leerOCR(
        zonas.apellido
    );

    texto = limpiarApellido(personaApellido);

    let personaDNI = await leerOCR(
        zonas.dni
    );

    persona.nacionalidad = personaNacionalidad;
    persona.nombre = personaNombre;
    persona.apellido = personaApellido;
    persona.dni = personaDNI;

}