const {JQueryRenderInterface} = require("./JQueryRenderInterface");
const FlightData = require("../dataReader/FlightData").FlightData;

class JQueryRenderSpeedData extends JQueryRenderInterface{

    //Classe per renderizzare ACCELERAZIONE, ACCELERAZIONE MINIMA E VIBRAZIONE

    static render() {
        $('#groundSpeed').html(FlightData.groundSpeed)
        $('#airSpeed').html(FlightData.airSpeed)
    }
}

exports.JQueryRenderSpeedData = JQueryRenderSpeedData;
