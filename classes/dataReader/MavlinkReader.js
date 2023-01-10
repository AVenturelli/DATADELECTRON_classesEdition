const { MavLinkPacketSplitter, MavLinkPacketParser,minimal, common, ardupilotmega, uavionix, icarous, asluav, ualberta } = require('node-mavlink')
//const FlightData = require("./FlightData").FlightData;
const Connection = require("../portConnection/Connection").Connection;
const PacketInterpreter = require("../dataReader/PacketInterpreter").PacketInterpreter;


class MavlinkReader {

    constructor() {
        //this.reader = undefined
        //this.paramIdList = []
        //this.paramList = []
        //globalThis.timer = undefined;
        //this.k = 0;
        //this.time = new Date();

        //this.counters = [];
        //this.messsagesTimer = [];

        //this.#adsbPlanesList = new AdsbPlaneList(viewer);
        
        //setInterval(this.checkParams,5000)


        //Aggiornamento

    }

    static startReader()
    {
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

    /*updateParam(param)
    {
        if(param.paramIndex <= param.paramCount - 1)
        {
            globalThis.timer = new Date()
            this.paramIdList.push(param.paramId)
            this.paramList[param.paramId] = param
            $('#paramProgressBar').val(Math.round((param.paramIndex/(param.paramCount-1))*100))
            setTimeout(this.showParams,3000,this.paramIdList,this.paramList)
        } 
    }

    /*
    }*/
    
    /*zeroArrays()
    {
        this.paramIdList = []
        this.paramList = []
    }

    addToCounter(className)
    {
       
        if(this.counters[className] !== undefined)
        {
            if(this.counters[className].length > 10)
            {
                //Faccio la media dei 10 valori
                let sum = 0;
                for(let item in this.counters[className])
                {
                    if(item != null){
                        sum += item;
                    }
                   
                }
                let tot = Math.round(sum/this.counters[className].length)
                console.log("Per la classe: "+className+", ho aspettato in media "+tot+" ms.");

                //Rimuovo il valore
                this.counters[className] = [];

            }
            else
            {
                console.log("aggiungo all'array"+ this.counters[className]);
                //Scrivo in ogni posto dell'array il tempo passato dallo scorso messaggio
                let now = new Date()
                //Metto nell'array nel posto del timpo del messaggio la differenza di tempo dei due messaggi dello stesso tipo finchè non ho 10 messaggi
                this.counters[className].push(now.getTime() - this.messsagesTimer[className].getTime())
                //Scrivo il tempo vecchio
                this.messsagesTimer[className] = new Date();
            }
        }
        else
        {
            this.counters[className] = [];
            //this.counters[className].push(null)
            this.messsagesTimer[className] = new Date();
        }
    }*/
}

  module.exports = MavlinkReader