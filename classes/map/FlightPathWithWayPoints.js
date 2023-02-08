const {WayPoint} = require("./WayPoint");

class FlightPathWithWayPoints {
    static wayPoints = [];
    static map = undefined;
    static currentDragLatLng = undefined;
    constructor() {
    }
    static setStatingPoint(lat,lon,map) {
        this.map = map;
        this.wayPoints.push(new WayPoint(L.latLng(lat,lon),map));
        this.updatePathList();
    }

    static addPoint(latLon){
        this.wayPoints.push(new WayPoint(latLon,this.map));
        this.updatePathList();

        //SE HO PIU DI UN PUNTO ABILITO IL PULSANTE
        //Abilito lo
        // del volo
        if(this.wayPoints.length > 1){
            $('#startJourney').prop('disabled',false);
        }
        else{
            $('#startJourney').prop('disabled',true);
        }
    }

    static removePoint(latLon){
        for (let i=1; i<this.wayPoints.length; i++){
            if(this.wayPoints[i].getLatLngPosition().equals(latLon)){
                this.wayPoints[i].deleteMarker()
                this.wayPoints.splice(i, 1);
            }
            this.updatePathList();
        }
        if(this.wayPoints.length < 2){
            $('#startJourney').prop('disabled',true);
        }
    }

    static clearPath() {
        this.wayPoints = [];
        this.updatePathList();

        //Tolgo la possibilità di fare partire la navigazione
        $('#startJourney').prop('disabled',true);

    }

    static updatePathList(){
        this.addPointsToFlightPath();
    }

    static addPointsToFlightPath(){

        if(this.wayPoints !== undefined) {

            if(this.flightPath !== undefined){
                this.map.removeLayer(this.flightPath);
            }

            for(let i = 0; i < this.wayPoints.length; i++){
                this.wayPoints[i].deleteMarker();
            }

            this.flightPath = L.polyline(this.wayPoints[0].getLatLngPosition(), {color: 'blue'}).addTo(this.map);

            for(let i = 0; i < this.wayPoints.length; i++){
               if(i !== 0) {

                   this.wayPoints[i].updateMarker();

                   this.wayPoints[i].getMarker().on('dragend',(e) => {
                       this.wayPoints[i].updatePosition(L.latLng(e.target._latlng.lat,e.target._latlng.lng))
                       this.updatePathList();
                   })
               }
                this.flightPath.addLatLng(this.wayPoints[i].getLatLngPosition());
            }
        }
    }

    static getMarkersPosition(){
        let points = []
        for(let i = 0; i < this.wayPoints.length; i++){
            points.push(this.wayPoints[i].getLatLngPosition())
        }
        return points;
    }

    static getWayPoints(){
        return this.wayPoints;
    }

    static setWayPointGreen(index){
        for(let i = 0; i < this.wayPoints.length; i++){
            if(i === index){
                this.wayPoints[index].setMarkerGreen()
            }
            else{
                this.wayPoints[i].setMarkerRed()
            }
        }
        this.updatePathList()
    }

    static setWayPointRed(){
        for(let i = 0; i < this.wayPoints.length; i++){
            this.wayPoints[i].setMarkerRed()
        }
        this.updatePathList()
    }

    static getWayPoint(index){
        return this.wayPoints[index];
    }

    static updatePoint(index,lat,lng,alt){
        this.wayPoints[index].updatePositionAndAlt(L.latLng(lat,lng),alt)
        this.updatePathList();
    }
    static changeWayPoint(oldIndex,newIndex){

        let newPoint = this.getWayPoint(newIndex);
        let oldPoint = this.getWayPoint(oldIndex);

        this.wayPoints[oldIndex] = newPoint;

        for(let i = oldIndex+1; i < this.wayPoints.length; i++){
            let temp = oldPoint;
            oldPoint = this.wayPoints[i];
            this.wayPoints[i] = temp;
        }

        this.wayPoints[newIndex] = oldPoint;

        this.updatePathList();
    }
}
exports.FlightPathWithWayPoints = FlightPathWithWayPoints