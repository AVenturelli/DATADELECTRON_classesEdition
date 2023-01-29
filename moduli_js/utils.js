////////////////////////////////////////////   
//              HTML INCLUDES             //
////////////////////////////////////////////

$("#connessione_centralina").load("componenti_html/connessione_centralina.html");
$("#impostazioni_generali").load("componenti_html/impostazioni_generali.html"); 
$("#param_button").load("componenti_html/allParameters.html"); 
$("#adsb_container").load("componenti_html/adsb.html"); 
$("#zoommatoio").load("componenti_html/zoomatoio.html"); 
//$("#siummatoio").load("componenti_html/levelTerrain.html"); 
$("#tettolone").load("componenti_html/roll_pitch.html"); 
$("#flight_data").load("componenti_html/flight_data.html"); 
$("#antennaGPS").load("componenti_html/antennaGPS.html");

$("#overlayCommands").load("componenti_html/overlayButtons.html");
$("#loadingCamera").load("componenti_html/loadingPlane.html");
$("#modalLink").load("componenti_html/cameraAddress.html");
$('#layoutManager').load("componenti_html/layoutSettings.html")

////////////////////////////////////////////   
//            GROUND LEVELING             //
////////////////////////////////////////////

//non funziano bho


////////////////////////////////////////////   
//         PITCH AND ROLL DIALS           //
////////////////////////////////////////////

function AnimateRotateRoll(){

    //1 - prendo la rotazione corrente e la metto all'inizio dell'animazione
    let elem = $("#plane_roll");
    let current_roll = getRotationDegrees(elem)
    let new_roll = Math.round(radians_to_degrees(globalThis.roll))

    $({deg: current_roll}).animate({deg: new_roll}, {
        duration: 16,
        step: function(now){
            elem.css({
                transform: "rotate(" + now + "deg)"
            });
        }
    });
}


function AnimateAltitude(){

    let currentFeets = globalThis.alt*3.281;
    let currentrPression = globalThis.pressure;

    if(globalThis.altitudeGauge !== undefined && globalThis.alt !== undefined && globalThis.pressure !== undefined)
    {
        globalThis.altitudeGauge.setAltitude(currentFeets)
        globalThis.altitudeGauge.setPressure(currentrPression)
    }
}

    
function AnimateHeading(){
    if(globalThis.heading !== undefined)
    {
        globalThis.headingGauge.setHeading(globalThis.heading * (180/Math.PI)-90)
    }
}

function AnimateRotatePitch(){

    let elem = $("#plane_pitch");
    let current_pitch = getRotationDegrees(elem)
    let new_pitch = Math.round(radians_to_degrees(globalThis.pitch))

    $({deg: current_pitch}).animate({deg: new_pitch}, {
        duration: 16,
        step: function(now){
            elem.css({
                transform: "rotate(" + now + "deg)"
            });
        }
    });
}

function test()
{
    globalThis.roll -= 0.01
    globalThis.pitch += 0.02
}

function getRotationDegrees(obj) {
    let angle;
    let matrix = obj.css("-webkit-transform") ||
    obj.css("-moz-transform")    ||
    obj.css("-ms-transform")     ||
    obj.css("-o-transform")      ||
    obj.css("transform");
    if(matrix !== 'none') {
        let values = matrix.split('(')[1].split(')')[0].split(',');
        let a = values[0];
        let b = values[1];
        return Math.round(Math.atan2(b, a) * (180/Math.PI));
    }else {
        return 0;
    }
}

function radians_to_degrees(radians) {
    let pi = Math.PI;
    return radians * (180/pi);
}

////////////////////////////////////////////   
//                ZOOOM                   //
////////////////////////////////////////////

$('#zoom_range').on('input', function (){
    let currentZoom = $('#current_zoom')
    if($(this).val() > 10000) {
        currentZoom.css("color", "red");
        currentZoom.css("font-weight", "700");
    }
    else {
        currentZoom.css("color", "black");
        $("#current_zoom").css("font-weight", "400");
    }
    currentZoom.val($(this).val())
    let current_zoom = $(this).val()
})

$("#current_zoom").on('change', function(){
    if($(this).val() > 20 && $(this).val() < 20000)
    {
        $("#zoom_range").val($(this).val())
        let current_zoom = $(this).val()
    }
})