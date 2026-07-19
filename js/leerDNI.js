function escanearDNI(img) {

    let src = cv.imread(img);

    let gray = new cv.Mat();
    cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY);

    let blur = new cv.Mat();
    cv.GaussianBlur(
        gray,
        blur,
        new cv.Size(5,5),
        0
    );

    let edges = new cv.Mat();
    cv.Canny(
        blur,
        edges,
        50,
        150
    );
    

    let kernel = cv.Mat.ones(5,5,cv.CV_8U);

    let dilated = new cv.Mat();

    cv.dilate(
        edges,
        dilated,
        kernel
    );

    let contours = new cv.MatVector();
    let hierarchy = new cv.Mat();

    cv.findContours(
        dilated,
        contours,
        hierarchy,
        cv.RETR_EXTERNAL,
        cv.CHAIN_APPROX_SIMPLE
    );

    let documento = null;
    let mayorArea = 0;

    for(let i=0;i<contours.size();i++){

    let cnt = contours.get(i);

    let area = cv.contourArea(cnt);

    let peri = cv.arcLength(cnt,true);

    let approx = new cv.Mat();

    cv.approxPolyDP(
        cnt,
        approx,
        0.02 * peri,
        true
    );


    let rect = cv.boundingRect(cnt);

    let ratio = rect.width / rect.height;


    if(
        approx.rows >= 4 &&
        approx.rows <= 6 &&
        ratio > 1.3 &&
        ratio < 1.8 &&
        area > mayorArea
    ){

        mayorArea = area;

        documento = approx.clone();

    }


    approx.delete();

}

    if(documento===null){

        alert("No se encontró el DNI");

        return;

    }

    let puntos=[];

    for(let i=0;i<4;i++){

        let p=documento.intPtr(i,0);

        puntos.push([

            p[0],
            p[1]

        ]);

    }

    puntos=ordenarPuntos(puntos);

    let srcTri=cv.matFromArray(
        4,
        1,
        cv.CV_32FC2,
        [

            puntos[0][0],puntos[0][1],
            puntos[1][0],puntos[1][1],
            puntos[2][0],puntos[2][1],
            puntos[3][0],puntos[3][1]

        ]
    );

    
    let escala = 5;
    let ancho = 856 * escala;
    let alto = 540 * escala;

    let dstTri=cv.matFromArray(
        4,
        1,
        cv.CV_32FC2,
        [

            0,0,
            ancho,0,
            ancho,alto,
            0,alto

        ]
    );

    let M=cv.getPerspectiveTransform(
        srcTri,
        dstTri
    );

    let warped=new cv.Mat();

    cv.warpPerspective(

        src,
        warped,
        M,
        new cv.Size(ancho,alto),
        cv.INTER_CUBIC

    );

    let zonas = recortarDNI(warped);
    
    ejecutarOCR(zonas);

    src.delete();
    gray.delete();
    blur.delete();
    edges.delete();
    dilated.delete();
    contours.delete();
    hierarchy.delete();

}

function ordenarPuntos(points){

    let ordered = [];

    let tl = points.reduce((a,b)=>
        (a[0]+a[1] < b[0]+b[1]) ? a : b
    );


    let br = points.reduce((a,b)=>
        (a[0]+a[1] > b[0]+b[1]) ? a : b
    );


    let tr = points.reduce((a,b)=>
        (a[0]-a[1] > b[0]-b[1]) ? a : b
    );


    let bl = points.reduce((a,b)=>
        (a[0]-a[1] < b[0]-b[1]) ? a : b
    );


    ordered.push(
        tl,
        tr,
        br,
        bl
    );


    return ordered;

}

function prepararOCR(imagen){

    let resultado = new cv.Mat();

    cv.cvtColor(
        imagen,
        resultado,
        cv.COLOR_RGBA2GRAY
    );

    let clahe = new cv.CLAHE(
        2.0,
        new cv.Size(8,8)
    );


    let contraste = new cv.Mat();

    clahe.apply(
        resultado,
        contraste
    );


    resultado.delete();

    let suavizado = new cv.Mat();

    cv.GaussianBlur(
        contraste,
        suavizado,
        new cv.Size(3,3),
        0
    );


    contraste.delete();


    let binario = new cv.Mat();

    cv.adaptiveThreshold(
        suavizado,
        binario,
        255,
        cv.ADAPTIVE_THRESH_GAUSSIAN_C,
        cv.THRESH_BINARY,
        31,
        10
    );


    suavizado.delete();


    return binario;

}