const MapPosition = require("./MapPosition").MapPosition;

class FlightPath {
    static path = [];

    static flightPath = undefined;
    static map = undefined;

    static markers = [];
    constructor() {
    }

    static setStatingPoint(lat,lon,map) {
        //let startingCoordinates = MapPosition.getHomeCoords()
        //if(startingCoordinates === undefined){return false;}
        this.map = map;
        this.path.push([lat,lon]);
        this.updatePathList();



    }

    static addPoint(latLon){
        this.path.push(latLon);
        this.updatePathList();

        //SE HO PIU DI UN PUNTO ABILITO IL PULSANTE
        //Abilito lo start del volo
        if(this.path.length > 1){
            $('#startJourney').prop('disabled',false);
        }
        else{
            $('#startJourney').prop('disabled',true);
        }
    }

    static removePoint(lat,lon){
        for (let i=0; i<this.path.length; i++){
            console.log(lat+" : "+this.path[i][0])
            if(this.path[i][0] === lat && this.path[i][1] === lon){
                this.path.splice(i, 1);
            }
            this.updatePathList();
        }
    }

    static clearPath() {
        this.path = [];
        this.updatePathList();

        //Tolgo la possibilità di fare partire la navigazione
        $('#startJourney').prop('disabled',true);

    }

    static updatePathList(){
        this.addPointsToFlightPath();
    }

    static addPointsToFlightPath(){

        if(this.path !== undefined) {

            if(this.flightPath !== undefined){
                this.map.removeLayer(this.flightPath);
            }

            if(this.markers !== undefined){
                for(let i = 0; i < this.markers.length; i++){
                    this.map.removeLayer(this.markers[i]);
                }
                this.markers = [];
            }

            //Creo il primo punto!
            this.flightPath = L.polyline([[this.path[0][0],this.path[0][1]]], {color: 'blue'}).addTo(this.map);

            for(let i = 0; i < this.path.length; i++) {

                this.flightPath.addLatLng(this.path[i])

                if(i !== 0) {
                    let redMarker = L.AwesomeMarkers.icon({
                        icon: 'house',
                        markerColor: 'red'
                    });

                    this.markers.push(L.marker([this.path[i][0], this.path[i][1]], {icon: redMarker}).addTo(this.map));
                }
            }

            //Disegno l'ultimo path verso casa!
            //this.flightPath.addLatLng(this.path[0])




        }
    }

    static getMarkersPosition(){
        let points = []
        for(let i = 0; i < this.markers.length; i++){
            points.push(this.markers[i].getLatLng())
        }
        return points;
    }
}
exports.FlightPath = FlightPath