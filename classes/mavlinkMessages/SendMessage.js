const {minimal, send, MavLinkProtocolV1, common} = require("node-mavlink");
const Cesium = require("cesium");
const Connection = require("../portConnection/Connection").Connection;

class SendMessage {
    constructor() {
    }

    static async setPlaneHome(lat, lon) {

        const message = new common.CommandInt();
        message.command = common.MavCmd.DO_SET_HOME;
        message.current = 0;
        message.targetSystem = 1;
        message.targetComponent = 0;
        message.param1 = 0;
        message.param5 = Math.round(parseFloat(lat)*10000000);
        message.param6 = Math.round(parseFloat(lon)*10000000);

        let positions = [
            Cesium.Cartographic.fromDegrees(
                parseFloat(lon) ,
                parseFloat(lat)
            )
        ];

        let viewer = DatadCesium.getViewer();

        let [updatedHeight] = await Promise.all([Cesium.sampleTerrain(viewer.terrainProvider, 12, positions)]);

        message.param7 = Math.round(updatedHeight[0].height*1000);
        //

        console.log(message);

        let serialPort = Connection.getSerialPort();
        send(serialPort, message, new MavLinkProtocolV1())

        ////////////////////////////7

        const messageRequest = new common.CommandInt();
        messageRequest.command = common.MavCmd.REQUEST_MESSAGE;
        messageRequest.param1 = 242;

        send(serialPort, messageRequest, new MavLinkProtocolV1())

    }
}

exports.SendMessage = SendMessage