const Connection = require('./Connection.js').Connection;
const MavlinkReader = require('../dataReader/MavlinkReader').MavlinkReader;
const Writer = require('../dataReader/MavlinkWriter.js')
const DatadSerialPorts = require("./DatadSerialPorts").DatadSerialPorts;
const ConnectionJQueryRenderer = require("../renderData/JQueryRendererConnection").ConnectionJQueryRenderer;
const DatadSerialPort = require('./DatadSerialPorts.js').DatadSerialPorts


class PortConnection {

    #currentConnection
    #currentPortName = undefined
    #currentPortNameWrite
    #currentBaudRate = undefined
    #currentBaudRateWrite
    #currentMavlinkReader
    #currentMavlinkWriter
    #connectionResult = false;
    #flightData
    #mavlinkParams

    constructor() {

        DatadSerialPort.listSerialPorts();

        this.#createListeners();
        this.#createClickers();
        this.#createChangers();
        this.#setIntervals();
    }

    #createListeners(){
        ConnectionJQueryRenderer.openConnectionDataModal();
    }

    #createClickers() {

        $('#port_refresh').click(() => {
            DatadSerialPort.listSerialPorts();
        })

        $('#save_conn_param').click(() =>
        {
            this.#currentBaudRate = parseInt($("#baud_rate").val())
            this.#currentPortName = $("#com_port").val()
            this.#currentPortNameWrite = $("#com_port_out").val()
            this.#currentBaudRateWrite = parseInt($("#baud_rate_out").val())

            ConnectionJQueryRenderer.closeConnectionDataModal()

            if(this.#currentPortName === null){

                let modal = new CustomAlert(
                    'connectionPortNotChosen',
                    'ATTENZIONE!',
                    'Non è stata scelta una porta seriale, non potrai effettuare una connessione!',
                );
                modal.printCode();
                modal.showAlert();
            }

        })

        $("#connect").click(() => {

            if(Connection.getSerialPort() === undefined &&
                this.#currentBaudRate !== undefined &&
                this.#currentBaudRate !== null &&
                this.#currentBaudRate !== "" &&
                this.#currentPortName !== undefined &&
                this.#currentPortName !== null &&
                this.#currentPortName !== "") {

                this.#doConnection();

            }
            else {
                let modal = new CustomAlert(
                    'connectionParamNotChosen',
                    'ATTENZIONE!',
                    'Non è stata scelta una porta seriale o non è stato scelto il baud rate',
                );
                modal.printCode();
                modal.showAlert();
            }
        })

        $("#disconnect").click(() => {
            this.#currentMavlinkReader = undefined
            this.#currentPortName = undefined
            Connection.closeConnection()
            ConnectionJQueryRenderer.setUiToNotConnected()
        })
    }

    #createChangers(){
        /*$("#customSwitch1").change(() =>
        {
            if($(this).is(':checked'))
            {
                $("#com_port_out").attr("disabled",false)
                $("#baud_rate_out").attr("disabled",false)

                this..write_data = true
            }
            else
            {
                $("#sendingDataFeedback").html("")
                $("#sendingDataFeedback").hide()
                $("#com_port_out").attr("disabled",true)
                $("#baud_rate_out").attr("disabled",true)
                globalThis.portnameWrite = undefined
                globalThis.baudWrite = undefined
                globalThis.write_data = false
            }
        })*/
    }

    #setIntervals(){

        setInterval(() => {
            if(
                Connection.getSerialPort() === undefined ||
                !Connection.getSerialPort().checkIfConnected()
            ) {
                ConnectionJQueryRenderer.setUiToNotConnected()
                DatadSerialPort.listSerialPorts();
            }
            else {
                ConnectionJQueryRenderer.setUiToConnected()
            }
        },2000)
    }

    #doConnection(){
        try {

            Connection.setPort(this.#currentPortName)
            Connection.setBaud(this.#currentBaudRate)

            MavlinkReader.startReader();

            this.#currentMavlinkReader = new MavlinkReader(
                this.#currentConnection.connectToPort(),
                this.#flightData,
                this.#mavlinkParams
            );

            this.#currentMavlinkReader.startReader()

            ConnectionJQueryRenderer.setUiToConnected();

            //$("#zoom_range").attr("disabled",false)
            //$("#current_zoom").attr("disabled",false)

            /*if(globalThis.write_data && globalThis.portnameWrite !== undefined && globalThis.baudWrite !== undefined)
            {
                globalThis.currentConnectionWrite = new PortConnection(globalThis.portnameWrite,globalThis.baudWrite)
                globalThis.currentWriter = new Writer(globalThis.currentConnectionWrite.connectToPort())
                globalThis.currentWriter.startWriting()
            }*/
        } catch (error) {
            console.error("Errore: "+ error)
            this.#currentConnection = undefined
            //globalThis.#currentConnectionWrite = undefined
            //globalThis.#currentWriter = undefined
        }
    }
}

exports.PortConnection = PortConnection;
