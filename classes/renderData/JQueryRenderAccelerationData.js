const {JQueryRenderInterface} = require("./JQueryRenderInterface");
const FlightData = require("../dataReader/FlightData").FlightData;

class JQueryRenderAccelerationData extends JQueryRenderInterface{

    //Classe per renderizzare ACCELERAZIONE, ACCELERAZIONE MINIMA E VIBRAZIONE

    static render() {
        $('#acc').html(FlightData.acceleration)
        $('#acc_max').html(FlightData.maxAcceleration)
        $('#vibr').html(FlightData.vibration+i/100)
    }
}

exports.JQueryRenderAccelerationData = JQueryRenderAccelerationData;
