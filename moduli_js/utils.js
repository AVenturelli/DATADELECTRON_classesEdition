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
////////////////////////////////////////////   
//            GROUND LEVELING             //
////////////////////////////////////////////

//non funziano bho


////////////////////////////////////////////   
//         PITCH AND ROLL DIALS           //
////////////////////////////////////////////

function AnimateRotateRoll(){

    //1 - prendo la rotazione corrente e la metto all'inizio dell'animazione
    current_roll = getRotationDegrees($("#plane_roll"))
    new_roll = Math.round(radians_to_degrees(globalThis.roll))
    
    var elem = $("#plane_roll");

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

function AnimateAltitude(){

    let currentFeets = globalThis.alt*3.281;
    let currentrPression = globalThis.pressure;

    if(globalThis.altitudeGauge !== undefined && globalThis.alt !== undefined && globalThis.pressure !== undefined)
    {
        globalThis.altitudeGauge.setAltitude(currentFeets)
        globalThis.altitudeGauge.setPressure(currentrPression)
    }
}

function AnimateRotatePitch(){

    current_pitch = getRotationDegrees($("#plane_pitch"))
    new_pitch = Math.round(radians_to_degrees(globalThis.pitch))
    var elem = $("#plane_pitch");        

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
    var matrix = obj.css("-webkit-transform") ||
    obj.css("-moz-transform")    ||
    obj.css("-ms-transform")     ||
    obj.css("-o-transform")      ||
    obj.css("transform");
    if(matrix !== 'none') {
        var values = matrix.split('(')[1].split(')')[0].split(',');
        var a = values[0];
        var b = values[1];
        var angle = Math.round(Math.atan2(b, a) * (180/Math.PI));
    } else { var angle = 0; }
    
    return angle //(angle < 0) ? angle + 360 : angle;
}

function radians_to_degrees(radians)
{
    var pi = Math.PI;
    return radians * (180/pi);
}

////////////////////////////////////////////   
//                ZOOOM                   //
////////////////////////////////////////////

$('#zoom_range').on('input', function (){
if($(this).val() > 10000)
{
    $("#current_zoom").css("color", "red");
    $("#current_zoom").css("font-weight", "700");
}
else
{
    $("#current_zoom").css("color", "black");
    $("#current_zoom").css("font-weight", "400");
    
}
$("#current_zoom").val($(this).val())
current_zoom = $(this).val()
})

$("#current_zoom").on('change', function(){
    if($(this).val() > 20 && $(this).val() < 20000)
    {
        $("#zoom_range").val($(this).val())
        current_zoom = $(this).val()
    }
})