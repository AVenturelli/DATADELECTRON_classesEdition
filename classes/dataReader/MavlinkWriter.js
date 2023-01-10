class MavlinkWriter {
    constructor(serialport) {
        this.serialport = serialport
        this.interval = undefined
    }

    startWriting()
    {
        this.interval = setInterval(this.write,200,this.serialport)
    }
    
    stopWriting()
    {
        if(this.interval !== undefined)
        {
            clearInterval(this.interval)
            $("#sendingDataFeedback").css("color","yellow")
            $("#sendingDataFeedback").html("La scrittura è stata fermata")
        }
    }

    write(serialport)
    {
        try {
            if(serialport !== undefined)
            {

                if(globalThis.temp_lat !== undefined)
                {
                    let text = '{ "X" : '+parseInt(globalThis.temp_lat) + ',"Y" : '+parseInt(globalThis.temp_lon)+ ',"H" : '+globalThis.temp_alt + ',"x" : '+globalThis.antennaX + ',"y" : '+globalThis.antennaY+ ',"h" : '+globalThis.antennaZ +'}';

                    serialport.write(text,"ascii")

                    $("#sendingDataFeedback").css("color","green")
                    
                    $("#sendingDataFeedback").html("Sto scrivendo su " + serialport.settings.path)
                }
                //let text = '{ "X" : '+parseInt(globalThis.lat*10000000) + ',"Y" : '+parseInt(globalThis.lon*10000000)+ ',"H" : '+parseInt((globalThis.alt-100)*1000) + ',"x" : '+globalThis.antennaX + ',"y" : '+globalThis.antennaY+ ',"h" : '+globalThis.antennaZ +'}';

                
            }
            else
            {
                clearInterval(this.interval)
                $("#sendingDataFeedback").css("color","red")
                $("#sendingDataFeedback").html("Errore nella scrittura")
            }
        } catch (error) {
            console.log(error)
        }
    }
}

module.exports = MavlinkWriter