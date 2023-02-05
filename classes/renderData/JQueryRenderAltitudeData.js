const {JQueryRenderInterface} = require("./JQueryRenderInterface");
const FlightData = require("../dataReader/FlightData").FlightData;

class JQueryRenderAltitudeData extends JQueryRenderInterface{

    constructor() {
        super();
    }

    //Classe per renderizzare ACCELERAZIONE, ACCELERAZIONE MINIMA E VIBRAZIONE




    static render() {
        let pressure = $('#pressure');
        let altitude = $('#alt');

        let pressureVal = 'Nan'
        let altitudeVal = 'Nan';

        if(FlightData.atmosphericPressure !== undefined ){
            pressureVal = FlightData.atmosphericPressure
        }

        if(FlightData.planeAltitude !== undefined ){
            altitudeVal = FlightData.planeAltitude
        }

        pressure.html(pressureVal+" <small>kPa</small>")
        altitude.html(altitudeVal+" <small>mt</small>")
    }
}

exports.JQueryRenderAltitudeData = JQueryRenderAltitudeData;
