const {mavlink,common, send, MavLinkProtocolV1, minimal} = require('node-mavlink');
const PacketInterpreter = require("../dataReader/PacketInterpreter").PacketInterpreter;
const Cesium = require("cesium");
const {SerialPort} = require("serialport");
const {set} = require("express/lib/application");

class Connection {

    static #serialPort = undefined
    static heartbeatInterval = undefined;
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
        this.#serialPort = undefined;
    }
    static get portName() {
        return this.#port
    }
    
    static connectToPort() {
        try {
            this.#serialPort = new SerialPort({path: this.#port, baudRate: this.#baud})
            this.setHeartBeatInterval();
        } catch (error) {
            let errorString = error.toString();
            if(!errorString.includes("path")){
                //Rimuovo il timer se presente
                this.#serialPort = undefined
                let a = new CustomAlert('customErrorConnectionAlert',"Could not connect to serial port","An error occurred while connecting to serial port "+ this.#port+" at baud: "+this.#baud+"\n\n Error: "+error)
                a.printCode();
                a.showAlert();
            }
            
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
        message.targetComponent = 1;
        message._param1 = 0;
        message._param5 = Math.round(parseFloat(lat) * 10000000);
        message._param6 = Math.round(parseFloat(lng) * 10000000);
        message._param7 = Math.round(updatedHeight[0].height * 1000);
        
        for(let i = 0; i < 3; i++){
            await send(this.#serialPort, message, new MavLinkProtocolV1());
        }
    }
    
    static async setArmed() {
        const arm = new common.CommandLong();
        arm.targetComponent = 1;
        arm.targetSystem = 1;
        arm.command = 400;
        arm._param1 = 1;
        arm._param2 = 2989;
    
        await send(this.#serialPort, arm, new MavLinkProtocolV1());
    }
    
    static async setDisarmed() {
        const arm = new common.CommandLong();
        arm.targetComponent = 1;
        arm.targetSystem = 1;
        arm.command = 400;
        arm._param1 = 0;
        arm._param2 = 2989;
        
        await send(this.#serialPort, arm, new MavLinkProtocolV1());
    }
    
    static async setMode(mode){
        const modeMsg = new common.CommandLong();
        modeMsg.targetComponent = 1;
        modeMsg.targetSystem = 1;
        modeMsg.command = 176;
        modeMsg._param1 = 1;
        modeMsg._param2 = mode;
    
        await send(this.#serialPort,modeMsg, new MavLinkProtocolV1());
    }
    
    static async setRTLHeight(height){
        const setRTLMsg = new common.CommandLong;
        setRTLMsg.command = common.M
    }
    
    static setHeartBeatInterval(){
        
        const message = new minimal.Heartbeat();
        message.type = 6
        message.autopilot = 8
        
        this.heartbeatInterval = setInterval(()=>{
            if(this.#serialPort !== undefined && this.checkIfConnected()){
                send(this.#serialPort, message, new MavLinkProtocolV1()).then();
            }
        },100);
        
    }
    
    static deleteConnection() {
        this.#serialPort = undefined;
        console.log(this.#serialPort)
    }
}
exports.Connection = Connection;