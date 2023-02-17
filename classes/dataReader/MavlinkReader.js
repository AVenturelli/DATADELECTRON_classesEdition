const { MavLinkPacketSplitter, MavLinkPacketParser,minimal, common, ardupilotmega, uavionix, icarous, asluav, ualberta } = require('node-mavlink')
const {SerialPort} = require("serialport");
//const FlightData = require("./FlightData").FlightData;
const Connection = require("../portConnection/Connection").Connection;
const PacketInterpreter = require("../dataReader/PacketInterpreter").PacketInterpreter;


class MavlinkReader {

    constructor() {}

    static startReader() {
        
        this.reader = Connection.getSerialPort().pipe(new MavLinkPacketSplitter()).pipe(new MavLinkPacketParser())
        const REGISTRY = {
            ...minimal.REGISTRY,
            ...common.REGISTRY,
            ...ardupilotmega.REGISTRY,
            ...uavionix.REGISTRY,
            ...icarous.REGISTRY,
            ...asluav.REGISTRY,
            ...ualberta.REGISTRY,
        }

        this.reader.on('data', packet => {
            const clazz = REGISTRY[packet.header.msgid]
            if (clazz) {
                const data = packet.protocol.data(packet.payload, clazz)
                PacketInterpreter.setData(data)
            }
        })
    }
}

exports.MavlinkReader = MavlinkReader