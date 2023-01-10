const FlightData = require("./FlightData").FlightData;
const AdsbPlaneList = require("../adsb/AdsbPlaneList").AdsbPlaneList;

class PacketInterpreter{
    constructor() {
    }
    static setData() {


        switch (data.constructor.name) {
            case 'ParamValue': break;
            case 'Heartbeat': break;
            case 'GlobalPositionInt' :
                FlightData.planeLatitude = (data.lat/10000000)
                FlightData.planeLongitude = (data.lat/10000000)
                FlightData.planeAltitude = (data.lat/10000000)
                break;
            case 'RawGps' : break;
            case 'ScaledImu2':
                let acceleration = Math.round(Math.sqrt(data.xacc*data.xacc+data.yacc*data.yacc+data.zacc*data.zacc)/1000*100)/100
                FlightData.acceleration = (acceleration);
                if(acceleration > FlightData.maxAcceleration() ) {
                    FlightData.acceleration = (acceleration)
                }
                break;
            case 'Vibration':
                let vibration = Math.round((data.vibrationX+data.vibrationY+data.vibrationX)/3*100)/100
                FlightData.vibration = (vibration)
                break;
            case 'VfrHud':
                let groundSpeed = Math.round(data.groundspeed*100)/100
                let airSpeed = Math.round(data.airspeed*100)/100
                FlightData.groundSpeed = (groundSpeed)
                FlightData.airSpeed = (airSpeed)
                break;
            case 'ScaledPressure':
                let pressure = Math.round(data.pressAbs*100)/100
                FlightData.atmosphericPressure = (pressure)
                break;
            case 'Attitude':
                FlightData.planeHeading = data.yaw
                FlightData.planePitch = data.pitch
                FlightData.planeRoll = (data.roll)
                FlightData.planeHeadingSpeed = (data.yawspeed)
                FlightData.planePitchSpeed = (data.pitchspeed)
                FlightData.planeRollSpeed = (data.rollspeed)
                break;
            case 'AdsbVehicle':
                let adsbData = new AdsbPlaneData();
                adsbData.adsbPlaneAltitude(data.altitude/1000);
                adsbData.adsbPlaneLatitude(data.lat);
                adsbData.adsbPlaneLongitude(data.lon);
                adsbData.adsbPlaneICAO(data.ICAOAddress)
                adsbData.adsbPlaneHeading(data.heading/100);
                adsbData.adsbPlaneCallsign(data.callsign);
                //Aggiorno e aggiungo l'aereo ricevuto!
                AdsbPlaneList.updatePlaneData(adsbData);

                break;
        }
    }
}
exports.PacketInterpreter = PacketInterpreter;
