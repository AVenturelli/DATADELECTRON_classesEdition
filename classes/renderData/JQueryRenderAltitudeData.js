const {JQueryRenderInterface} = require("./JQueryRenderInterface");
const FlightData = require("../dataReader/FlightData").FlightData;

class JQueryRenderAltitudeData extends JQueryRenderInterface{

    constructor() {
        super();
    }

    //Classe per renderizzare ACCELERAZIONE, ACCELERAZIONE MINIMA E VIBRAZIONE

    static #pressure = $('#pressure');
    static #altitude = $('#alt');

    static render() {
        this.#pressure.html(FlightData.atmosphericPressure)
        this.#altitude.html(FlightData.planeAltitude)
    }
}

exports.JQueryRenderAltitudeData = JQueryRenderAltitudeData;
