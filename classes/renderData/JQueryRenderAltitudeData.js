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

        pressure.html(FlightData.atmosphericPressure)
        altitude.html(FlightData.planeAltitude)
    }
}

exports.JQueryRenderAltitudeData = JQueryRenderAltitudeData;
