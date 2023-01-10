const { SerialPort } = require('serialport')
const ConnectionJQueryRenderer = require('../renderData/JQueryRendererConnection').ConnectionJQueryRenderer

class DatadSerialPorts{

    constructor() {
    }

    static listSerialPorts(){

        SerialPort.list().then((ports, err) => {
            if(err) {
                console.error(err.message)
                return
            }
            if (ports.length === 0) {
                ConnectionJQueryRenderer.setConnectionMessageNoneAvailable();
                return
            }
            else {
                ConnectionJQueryRenderer.setConnectionMessageAvailable();
            }
            ConnectionJQueryRenderer.displaySerialPorts(ports)
        })
    }
}

exports.DatadSerialPorts = DatadSerialPorts;
