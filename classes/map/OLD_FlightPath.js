const MapPosition = require("./MapPosition").MapPosition;

class OLD_FlightPath {
    static path = [];

    static flightPath = undefined;
    static map = undefined;

    static markers = [];

    static currentDragLatLng = undefined;
    constructor() {
    }

    static setStatingPoint(lat,lon,map) {
        //let startingCoordinates = MapPosition.getHomeCoords()
        //if(startingCoordinates === undefined){return false;}
        this.map = map;
        this.path.push(L.latLng(lat,lon));
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

    static removePoint(latLon){
        for (let i=0; i<this.path.length; i++){
            if(this.path[i].equals(latLon)){
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
            this.flightPath = L.polyline(this.path[0], {color: 'blue'}).addTo(this.map);

            for(let i = 0; i < this.path.length; i++) {

                this.flightPath.addLatLng(this.path[i])

                if(i !== 0) {
                    let redMarker = L.AwesomeMarkers.icon({
                        icon: 'house',
                        markerColor: 'red'
                    });

                    let currentMarker = L.marker(this.path[i], {icon: redMarker,draggable: true}).addTo(this.map);

                    currentMarker.on('dragend',(e) => {
                        for(let k = 0; k < this.path.length; k++){
                            if(this.path[k].equals(this.currentDragLatLng)){
                                this.path[k] = L.latLng(e.target._latlng.lat,e.target._latlng.lng)
                                this.currentDragLatLng = undefined;
                            }
                            this.updatePathList()
                        }
                    })

                    currentMarker.on('dragstart ',(e) =>{this.currentDragLatLng = L.latLng(e.target._latlng.lat,e.target._latlng.lng)})

                    this.markers.push(currentMarker);
                }
            }
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
exports.FlightPath = OLD_FlightPath