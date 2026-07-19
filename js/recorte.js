// recortes.js


function recortarDNI(dni) {


    // ==============================
    // ZONAS RELATIVAS DEL DNI
    // ==============================

    const zonas = {


        foto: {
            x: 0.068,
            y: 0.22,
            ancho: 0.31,
            alto: 0.50
        },


        nombre: {
            x: 0.4,
            y: 0.3,
            ancho: 0.45,
            alto: 0.05
        },

        apellido: {
            x: 0.4,
            y: 0.17,
            ancho: 0.55,
            alto: 0.05
        },


        dni: {
            x: 0.05,
            y: 0.815,
            ancho: 0.28,
            alto: 0.12
        },


        nacionalidad: {
            x: 0.53,
            y: 0.42,
            ancho: 0.2,
            alto: 0.05
        }

    };



    // ==============================
    // FUNCIÓN DE CONVERSIÓN
    // RELATIVO -> PIXELES
    // ==============================

    function crearRect(zona){


        return new cv.Rect(

            Math.round(dni.cols * zona.x),

            Math.round(dni.rows * zona.y),

            Math.round(dni.cols * zona.ancho),

            Math.round(dni.rows * zona.alto)

        );

    }



    // ==============================
    // HACER RECORTES
    // ==============================

    let foto = dni.roi(
        crearRect(zonas.foto)
    );

    let apellido = dni.roi(
        crearRect(zonas.apellido)
    );

    let nombre = dni.roi(
        crearRect(zonas.nombre)
    );


    let numeroDNI = dni.roi(
        crearRect(zonas.dni)
    );


    let nacionalidad = dni.roi(
        crearRect(zonas.nacionalidad)
    );

    const canvas = document.createElement("canvas");

    cv.imshow(canvas, foto);

    persona.foto = canvas.toDataURL("image/png");


    
    // Mostrar para pruebas
    
    /*cv.imshow(
        "recorteFoto",
        foto
        );
        
        cv.imshow(
            "prueba",
            foto
        );
        

    cv.imshow(
        "recorteApellido",
        apellido
    );
    
    cv.imshow(
        "recorteNacionalidad",
        nacionalidad
    );
            
    cv.imshow(
        "recorteDNI",
        numeroDNI
        );
    
    */       
           
    return {

        foto,
        nombre,
        apellido,
        dni: numeroDNI,
        nacionalidad
    };

}