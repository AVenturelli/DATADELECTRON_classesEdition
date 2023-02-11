const {minimal, send, MavLinkProtocolV1, common} = require("node-mavlink");
const Cesium = require("cesium");
const Connection = require("../portConnection/Connection").Connection;

class SendMessage {
	constructor() {
	}
	static async setPlaneHome(lat, lon) {
		
		//Preparo il messaggio per settare la home
		const message = new common.CommandInt();
		message.command = common.MavCmd.DO_SET_HOME;
		message.current = 0;
		message.targetSystem = 1;
		message.targetComponent = 0;
		message.param1 = 0;
		message.x = Math.round(parseFloat(lat) * 10000000);
		message.y = Math.round(parseFloat(lon) * 10000000);
		//Prendo l'altezza del suolo relativa alle coordinate grazie a cesium
		let positions = [
			Cesium.Cartographic.fromDegrees(
				parseFloat(lon),
				parseFloat(lat)
			)
		];
		let viewer = DatadCesium.getViewer();
		let [updatedHeight] = await Promise.all([Cesium.sampleTerrain(viewer.terrainProvider, 12, positions)]);
		message.z = Math.round(updatedHeight[0].height * 1000);
		//Preview del messaggio che sto per inivare
		console.log(message);
		//Mando il messaggio alla porta Seriale e alla Centralina
		let serialPort = Connection.getSerialPort();
		await send(serialPort, message, new MavLinkProtocolV1())
		
		////////////////////////////
		//Mando il comando per richiedere la homePosition
		const messageRequest = new common.CommandInt();
		messageRequest.command = common.MavCmd.REQUEST_MESSAGE;
		messageRequest.param1 = 242;
		console.log(messageRequest);
		await send(serialPort, messageRequest, new MavLinkProtocolV1())
	}
}

exports.SendMessage = SendMessage