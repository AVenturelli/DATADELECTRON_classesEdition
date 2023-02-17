const {mavlink,common, send, MavLinkProtocolV1} = require('node-mavlink');
const PacketInterpreter = require("../dataReader/PacketInterpreter").PacketInterpreter;
const Cesium = require("cesium");
const {SerialPort} = require("serialport");

class Connection {

    static #serialPort = undefined
    static #heartBeatInterval
    static #port = undefined
    static #baud = undefined
    
    static mavlinkClient = undefined;
    
    constructor() {
    }
    static setPort(port){
        this.#port = port
    }
    static setBaud(baud){
        this.#baud = baud
    }
    static getSerialPort(){
        return this.#serialPort
    }
    
    static checkIfConnected() {
        return this.#serialPort.isOpen
    }
    static closeConnection() {
        this.#serialPort.close()
    }
    static get portName() {
        return this.#port
    }
    
    static connectToPort() {
        try {
            
            this.#serialPort = new SerialPort({path: this.#port, baudRate: this.#baud})
            
        } catch (error) {
            //Rimuovo il timer se presente
            this.#serialPort = undefined
        }
    }
    static async sendDoSetHomeMessage(lat, lng) {
    
        let positions = [
            Cesium.Cartographic.fromDegrees(
                parseFloat(lng),
                parseFloat(lat)
            )
        ];
        let viewer = DatadCesium.getViewer();
        let [updatedHeight] = await Promise.all([Cesium.sampleTerrain(viewer.terrainProvider, 12, positions)]);
        
        const message = new common.CommandInt();
        message.command = common.MavCmd.DO_SET_HOME;
        message.current = 0;
        message.targetSystem = 1;
        message.targetComponent = 0;
        message._param1 = 0;
        message._param5 = Math.round(parseFloat(lat) * 10000000);
        message._param6 = Math.round(parseFloat(lng) * 10000000);
        message._param7 = Math.round(updatedHeight[0].height * 1000);
        
        await send(this.#serialPort, message, new MavLinkProtocolV1());
    }
}
exports.Connection = Connection;