const Connection = require('./Connection.js').Connection;
const MavlinkReader = require('../dataReader/MavlinkReader').MavlinkReader;
const Writer = require('../dataReader/MavlinkWriter.js')
const PacketInterpreter = require("../dataReader/PacketInterpreter").PacketInterpreter;
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
		this.#setIntervals();
	}
	
	#createListeners() {
		ConnectionJQueryRenderer.openConnectionDataModal();
	}
	
	#createClickers() {
		
		$('#port_refresh').click(() => {
			DatadSerialPort.listSerialPorts();
		})
		
		$('#save_conn_param').click(() => {
			this.#currentBaudRate = parseInt($("#baud_rate").val())
			this.#currentPortName = $("#com_port").val()
			this.#currentPortNameWrite = $("#com_port_out").val()
			this.#currentBaudRateWrite = parseInt($("#baud_rate_out").val())
			ConnectionJQueryRenderer.closeConnectionDataModal()
			if (this.#currentPortName === null) {
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
			if (Connection.getSerialPort() === undefined &&
				this.#currentBaudRate !== undefined &&
				this.#currentBaudRate !== null &&
				this.#currentBaudRate !== "" &&
				this.#currentPortName !== undefined &&
				this.#currentPortName !== null &&
				this.#currentPortName !== "") {
				this.#doConnection();
			} else {
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
		
		$('#checkMsgsIncoming').on('click', () => {
			FrequencyGraph.startFrequencyReading();
		})
		
		$('#setArmed').on('click',() =>{
			Connection.setArmed();
		})
		
		$('#setDisarmed').on('click',() =>{
			Connection.setDisarmed();
		})
		
		$('#setMode').on('click', () => {
			let mode = $('#flightModes').val();
			Connection.setMode(mode);
		})
		
		$('#PANIC').on('click', () => {
			let height = $('#panicHeight').val();
			
			Connection.setRTLHeight(height).then(() =>{
				Connection.setMode(11).then(() =>{
					let a = new CustomAlert('panicAlert','PANIC BUTTON PRESSED','You pressed the panic button cuz u scared. Don\'t worry, the drone will be back soon :)');
					a.printCode();
					a.showAlert();
				});
			})
		})
	}
	
	#setIntervals() {
		setInterval(() => {
			if (Connection.getSerialPort() === undefined || (Connection.getSerialPort() !== undefined && !Connection.checkIfConnected())) {
				ConnectionJQueryRenderer.setUiToNotConnected()
			} else {
				ConnectionJQueryRenderer.setUiToConnected()
			}
		}, 2000)
	}
	
	#doConnection() {
		try {
			Connection.setPort(this.#currentPortName)
			Connection.setBaud(this.#currentBaudRate)
			Connection.connectToPort();
			MavlinkReader.startReader();
			ConnectionJQueryRenderer.setUiToConnected();
		} catch (error) {
			this.#currentConnection = undefined
			let a = new CustomAlert('failedConnection', "CONNESSIONE FALLITA", "La connessione alla porta " + this.#currentPortName + " con baud rate di " + this.#currentBaudRate + " è fallita con errore: <br><strong>" + error + "</strong>")
			a.printCode()
			a.showAlert()
		}
	}
}

exports.PortConnection = PortConnection;
