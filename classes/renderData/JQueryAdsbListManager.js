// noinspection JSJQueryEfficiency
class JQueryAdsbListManager{

    constructor() {
    }
    static addToList(ICAO,planeText){
        if($('#'+ICAO).length === 0)
        {
            $('#adsb').append("<li class='adsb_plane' id='"+ICAO+"'>"+ planeText +"</li>")
        }
    }
    static removeFromList(ICAO){
        if($('#'+ICAO).length !== 0)
        {
            $('#'+ICAO).remove()
        }
    }

    static update(ICAO,planetext){
        if($('#'+ICAO).length !== 0)
        {
            $('#'+ICAO).html(planetext)
        }
    }
}

exports.JQueryAdsbListManager = JQueryAdsbListManager;
