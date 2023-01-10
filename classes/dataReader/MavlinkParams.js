const {common, send, MavLinkProtocolV1} = require("node-mavlink");
const Connection = require("../portConnection/Connection").Connection;

class MavlinkParams {

    static #params = [];

    constructor() {
        if (this instanceof MavlinkParams) {
            throw Error('A static class cannot be instantiated.');
        }
    }

    static getParamCounts(){
        return this.#params.length
    }

    static getAllParams(){
        return this.#params
    }

    static getSingleParams(paramId){

    }

    static requestAllParams() {
        const message = new common.ParamRequestList()
        message.targetSystem = 1
        message.targetComponent = 0
        if(Connection.getSerialPort() !== undefined) {
            send(Connection.getSerialPort(), message, new MavLinkProtocolV1()).then(r => {
                console.log(r)
            });
        }
        else {
            let a = new CustomAlert(
                'noConnectionForParams',
                'ATTENZIONE',
                'Nessuna connessione disponibile alla quale richiedere parametri.')
            a.printCode()
            a.showAlert()

        }

    }

    static populateParams(){

        let xmlhttp,xmlDoc;

        if (window.XMLHttpRequest) {
            xmlhttp = new XMLHttpRequest();
        } else {
            xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
        }

        xmlhttp.open("GET", "paramDescriptions.xml", false);
        xmlhttp.send();
        xmlDoc = xmlhttp.responseXML;

        for (let i in xmlDoc.getElementsByTagName("group")) {
            let childern = xmlDoc.getElementsByTagName("group")[i].childNodes
            for (let k in childern) {
                if (childern[k].nodeType === 1) {
                    let nodeName = childern[k].getAttribute("name")
                    this.#params[nodeName] = []
                    let childern_2 = childern[k].childNodes
                    for (let j in childern_2) {
                        if (childern_2[j].nodeType === 1) {
                            this.#params[nodeName][childern_2[j].nodeName] = childern_2[j].textContent
                        }
                    }
                }
            }
        }
    }
}

exports.MavlinkParams = MavlinkParams;
