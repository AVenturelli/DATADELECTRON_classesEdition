const {AdsbPlaneData} = require("../adsb/AdsbPlaneData");
const FlightData = require("./FlightData").FlightData;
const AdsbPlaneList = require("../adsb/AdsbPlaneList").AdsbPlaneList;

class PacketInterpreter{
    constructor() {
    }
    static setData(data) {
        //console.log(data)
        switch (data.constructor.name) {

            case 'ParamValue': break;
            case 'NavControllerOutput': break;
            case 'PositionTargetGlobalInt': break;
            case 'HomePosition': console.log(data); break;
            case 'Heartbeat': break;
            case 'ScaledPressure2': break;
            case 'ScaledPressure3': break;
            case 'RawImu': break;
            case 'Ahrs': break;
            case 'TerrainReport': break;
            case 'EkfStatusReport': break;
            case 'BatteryStatus': break;
            case 'ScaledImu3': break;
            case 'Wind': break;
            case 'LocalPositionNed': break;
            case 'SystemTime': break;
            case 'HwStatus': break;
            case 'MissionCurrent': break;
            case 'MemInfo': break;
            case 'PowerStatus': break;
            case 'Gps2Raw': break;
            case 'GpsRawInt': break;
            case 'SysStatus': break;
            case 'RcChannelsRaw': break;
            case 'RcChannels': break;
            case 'ServoOutputRaw': break;
            case 'TimeSync': break;
            case 'Ahrs2': break;
            case 'GlobalPositionInt' :
                FlightData.planeLatitude = (data.lat/10000000)
                FlightData.planeLongitude = (data.lon/10000000)
                FlightData.planeAltitude = (data.alt/1000)
                break;
            case 'RawGps' : break;
            case 'ScaledImu2':
                let acceleration = Math.round(Math.sqrt(data.xacc*data.xacc+data.yacc*data.yacc+data.zacc*data.zacc)/1000*100)/100
                FlightData.acceleration = (acceleration);
                if(acceleration > FlightData.maxAcceleration ) {
                    FlightData.maxAcceleration = (acceleration)
                }
                break;
            case 'Vibration':
                let vibration = Math.round((data.vibrationX+data.vibrationY+data.vibrationX)/3)
                FlightData.vibration = (vibration)
                break;
            case 'VfrHud':
                let groundSpeed = Math.round(data.groundspeed*100)/100
                let airSpeed = Math.round(data.airspeed*100)/100
                FlightData.groundSpeed = (groundSpeed)
                FlightData.airSpeed = (airSpeed)
                break;
            case 'ScaledPressure':
                let pressure = Math.round(data.pressAbs)
                FlightData.atmosphericPressure = (pressure)
                break;
            case 'Attitude':
                FlightData.planeHeading = this.getDegreeAngleFromRad(data.yaw)
                FlightData.planePitch =  this.getDegreeAngleFromRad(data.pitch)
                FlightData.planeRoll =  this.getDegreeAngleFromRad(data.roll)
                FlightData.planeHeadingSpeed = (data.yawspeed)
                FlightData.planePitchSpeed = (data.pitchspeed)
                FlightData.planeRollSpeed = (data.rollspeed)
                break;
            case 'AdsbVehicle':
                /*let adsbData = new AdsbPlaneData(data.ICAOAddress);
                console.log(adsbData)
                adsbData.adsbPlaneAltitude(data.altitude/1000);
                adsbData.adsbPlaneLatitude(data.lat);
                adsbData.adsbPlaneLongitude(data.lon);
                adsbData.adsbPlaneHeading(data.heading/100);
                adsbData.adsbPlaneCallsign(data.callsign);
                //Aggiorno e aggiungo l'aereo ricevuto!
                AdsbPlaneList.updatePlaneData(adsbData);*/

                break;
            default: console.log(data);
        }
    }
    static getDegreeAngleFromRad(radValue) {
        return radValue / Math.PI * 180;
    }
}
exports.PacketInterpreter = PacketInterpreter;
