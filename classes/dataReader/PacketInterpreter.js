const {AdsbPlaneData} = require("../adsb/AdsbPlaneData");
const {PacketInterpreterRender} = require("../renderData/PacketInterpreterRender");
const FlightData = require("./FlightData").FlightData;
const AdsbPlaneList = require("../adsb/AdsbPlaneList").AdsbPlaneList;

class PacketInterpreter {

	static msgArray = {
		"messages":
        [
            {name: 'ParamValue', count: 0},
            {name: 'NavControllerOutput', count: 0},
            {name: 'PositionTargetGlobalInt', count: 0},
            {name: 'HomePosition', count: 0},
            {name: 'Heartbeat', count: 0},
            {name: 'ScaledPressure2', count: 0},
            {name: 'ScaledPressure3', count: 0},
            {name: 'RawImu', count: 0},
            {name: 'Ahrs', count: 0},
            {name: 'TerrainReport', count: 0},
            {name: 'EkfStatusReport', count: 0},
            {name: 'BatteryStatus', count: 0},
            {name: 'ScaledImu3', count: 0},
            {name: 'Wind', count: 0},
            {name: 'LocalPositionNed', count: 0},
            {name: 'SystemTime', count: 0},
            {name: 'HwStatus', count: 0},
            {name: 'MissionCurrent', count: 0},
            {name: 'PowerStatus', count: 0},
            {name: 'MemInfo', count: 0},
            {name: 'Gps2Raw', count: 0},
            {name: 'GpsRawInt', count: 0},
            {name: 'SysStatus', count: 0},
            {name: 'RcChannelsRaw', count: 0},
            {name: 'RcChannels', count: 0},
            {name: 'ServoOutputRaw', count: 0},
            {name: 'TimeSync', count: 0},
            {name: 'Ahrs2', count: 0},
            {name: 'GlobalPositionInt', count: 0},
            {name: 'RawGps', count: 0},
            {name: 'ScaledImu2', count: 0},
            {name: 'Vibration', count: 0},
            {name: 'VfrHud', count: 0},
            {name: 'ScaledPressure', count: 0},
            {name: 'Attitude', count: 0},
	        {name: 'GpsGlobalOrigin', count: 0},
            {name: 'AdsbVehicle', count: 0},
	        {name: 'StatusText', count: 0},
	        {name: 'AoaSsa', count: 0}
        ]
	}
	
	constructor() {
	}
	
	
	static setData(data) {
		//console.log(data
		switch (data.constructor.name) {
			
			case 'ParamValue':
				break;
			case 'AoaSsa':
				break;
			case 'GpsGlobalOrigin':
				break;
			case 'StatusText':
				break;
			case 'NavControllerOutput':
				break;
			case 'PositionTargetGlobalInt':
				break;
			case 'HomePosition':
				this.drawHome(data);
				break;
			case 'Heartbeat':
				
				//TODO: interpretare la bitmap data.baseMode
				let mode = data.baseMode;
				let type = data.type;
				
				if(type === 1 && mode >= 128) {
					PacketInterpreterRender.setArmed();
				}
				if (type === 1 && mode < 128){
					PacketInterpreterRender.setDisarmed();
				}
				
				if (data.type === 1){
					PacketInterpreterRender.updateFlightMode(data.customMode);
				}
				break;
			case 'ScaledPressure2':
				break;
			case 'ScaledPressure3':
				break;
			case 'RawImu':
				break;
			case 'Ahrs':
				break;
			case 'TerrainReport':
				break;
			case 'EkfStatusReport':
				break;
			case 'BatteryStatus':
				break;
			case 'ScaledImu3':
				break;
			case 'Wind':
				break;
			case 'LocalPositionNed':
				break;
			case 'SystemTime':
				break;
			case 'HwStatus':
				break;
			case 'MissionCurrent':
				break;
			case 'MemInfo':
				break;
			case 'PowerStatus':
				FlightData.currentBattery = ((data.Vservo/1000-4)/1.2)*100
				PacketInterpreterRender.setBatteryLevel()
				break;
			case 'Gps2Raw':
				break;
			case 'GpsRawInt':
				break;
			case 'SysStatus':
				break;
			case 'RcChannelsRaw':
				break;
			case 'RcChannels':
				break;
			case 'ServoOutputRaw':
				break;
			case 'TimeSync':
				break;
			case 'Ahrs2':
				break;
			case 'GlobalPositionInt' :
				FlightData.planeLatitude = (data.lat / 10000000)
				FlightData.planeLongitude = (data.lon / 10000000)
				FlightData.planeAltitude = (data.alt / 1000)
				break;
			case 'RawGps' :
				break;
			case 'ScaledImu2':
				let acceleration = Math.round(Math.sqrt(data.xacc * data.xacc + data.yacc * data.yacc + data.zacc * data.zacc) / 1000 * 100) / 100
				FlightData.acceleration = (acceleration);
				if (acceleration > FlightData.maxAcceleration) {
					FlightData.maxAcceleration = (acceleration)
				}
				break;
			case 'Vibration':
				let vibration = Math.round((data.vibrationX + data.vibrationY + data.vibrationX) / 3)
				FlightData.vibration = (vibration)
				break;
			case 'VfrHud':
				let groundSpeed = Math.round(data.groundspeed * 100) / 100
				let airSpeed = Math.round(data.airspeed * 100) / 100
				FlightData.groundSpeed = (groundSpeed)
				FlightData.airSpeed = (airSpeed)
				break;
			case 'ScaledPressure':
				let pressure = Math.round(data.pressAbs)
				FlightData.atmosphericPressure = (pressure)
				break;
			case 'Attitude':
				FlightData.planeHeading = this.getDegreeAngleFromRad(data.yaw)
				FlightData.planePitch = this.getDegreeAngleFromRad(data.pitch)
				FlightData.planeRoll = this.getDegreeAngleFromRad(data.roll)
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
			default:
				console.log(data);
		}
		
		for(let i in this.msgArray.messages){
			if(this.msgArray.messages[i].name === data.constructor.name){
				this.msgArray.messages[i].count++;
			}
		}
	}
	
	static getDegreeAngleFromRad(radValue) {
		return radValue / Math.PI * 180;
	}
	
	static getMessagesList(){
		let returnArray = [];
		for(let i in this.msgArray.messages){
			returnArray.push(this.msgArray.messages[i].name)
		}
		return returnArray;
	}
	static getMessagesArray(){
		return this.msgArray;
	}
	
	static setCountToZero() {
		for(let i in this.msgArray.messages){
			this.msgArray.messages[i].count = 0;
		}
	}
	
	static drawHome(data){
		console.log(data)
	}
}

exports.PacketInterpreter = PacketInterpreter;
