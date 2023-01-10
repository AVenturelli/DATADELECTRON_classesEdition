const {SerialPort} = require('serialport')
const {MavEsp8266, common, MavLinkProtocolV1, send, ardupilotmega, minimal, sleep} = require('node-mavlink')

class Connection {

    static #serialPort = undefined
    static #heartBeatInterval
    static #port = undefined
    static #baud = undefined
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
    static connectToPort() {
        try {
            this.#serialPort = new SerialPort({path: this.#port, baudRate: this.#baud})

            //Mando un HeartBeat una volta ogni 1 secondi.
            this.#heartBeatInterval = setInterval(this.#sendHeartbeat, 1000);

        } catch (error) {
            console.error(error)
            //Rimuovo il timer se presente
            this.#serialPort = undefined
            if (this.#heartBeatInterval !== undefined) {
                clearInterval(this.#heartBeatInterval);
            }
        }
    }
    static checkIfConnected() {
        return this.#serialPort.isOpen
    }
    static closeConnection() {
        globalThis.serial_port.close()
    }
    static get portName() {
        return this.#port
    }
    //Command not found
    static #sendHeartbeat() {
        if (globalThis.serial_port !== undefined) {
            const message = new minimal.Heartbeat();
            message.targetSystem = 1;
            message.autopilot = 8;
            message.type = 6;
            message.targetComponent = 0;
            send(this.#serialPort, message, new MavLinkProtocolV1()).then(r => console.log("HeartBeat Mandato"))
        }
    }
}
exports.Connection = Connection;