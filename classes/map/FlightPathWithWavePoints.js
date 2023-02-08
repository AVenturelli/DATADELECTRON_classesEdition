const {WavePoint} = require("./WavePoint");

class FlightPathWithWavePoints {
    static wavePoints = [];
    static map = undefined;
    static currentDragLatLng = undefined;
    constructor() {
    }
    static setStatingPoint(lat,lon,map) {
        this.map = map;
        this.wavePoints.push(new WavePoint(L.latLng(lat,lon),map));
        this.updatePathList();
    }

    static addPoint(latLon){
        this.wavePoints.push(new WavePoint(latLon,this.map));
        this.updatePathList();

        //SE HO PIU DI UN PUNTO ABILITO IL PULSANTE
        //Abilito lo
        // del volo
        if(this.wavePoints.length > 1){
            $('#startJourney').prop('disabled',false);
        }
        else{
            $('#startJourney').prop('disabled',true);
        }
    }

    static removePoint(latLon){
        for (let i=1; i<this.wavePoints.length; i++){
            if(this.wavePoints[i].getLatLngPosition().equals(latLon)){
                this.wavePoints[i].deleteMarker()
                this.wavePoints.splice(i, 1);
            }
            this.updatePathList();
        }
        if(this.wavePoints.length < 2){
            $('#startJourney').prop('disabled',true);
        }
    }

    static clearPath() {
        this.wavePoints = [];
        this.updatePathList();

        //Tolgo la possibilità di fare partire la navigazione
        $('#startJourney').prop('disabled',true);

    }

    static updatePathList(){
        this.addPointsToFlightPath();
    }

    static addPointsToFlightPath(){

        if(this.wavePoints !== undefined) {

            if(this.flightPath !== undefined){
                this.map.removeLayer(this.flightPath);
            }

            for(let i = 0; i < this.wavePoints.length; i++){
                this.wavePoints[i].deleteMarker();
            }

            this.flightPath = L.polyline(this.wavePoints[0].getLatLngPosition(), {color: 'blue'}).addTo(this.map);

            for(let i = 0; i < this.wavePoints.length; i++){
               if(i !== 0) {

                   this.wavePoints[i].updateMarker();

                   this.wavePoints[i].getMarker().on('dragend',(e) => {
                       this.wavePoints[i].updatePosition(L.latLng(e.target._latlng.lat,e.target._latlng.lng))
                       this.updatePathList();
                   })
               }
                this.flightPath.addLatLng(this.wavePoints[i].getLatLngPosition());
            }
        }
    }

    static getMarkersPosition(){
        let points = []
        for(let i = 0; i < this.wavePoints.length; i++){
            points.push(this.wavePoints[i].getLatLngPosition())
        }
        return points;
    }

    static getWavePoints(){
        return this.wavePoints;
    }

    static setWavePointGreen(index){
        for(let i = 0; i < this.wavePoints.length; i++){
            if(i === index){
                this.wavePoints[index].setMarkerGreen()
            }
            else{
                this.wavePoints[i].setMarkerRed()
            }
        }
        this.updatePathList()
    }

    static setWavePointRed(){
        for(let i = 0; i < this.wavePoints.length; i++){
            this.wavePoints[i].setMarkerRed()
        }
        this.updatePathList()
    }

    static getWavePoint(index){
        return this.wavePoints[index];
    }

    static changeWavePoint(oldIndex,newIndex){

        let newPoint = this.getWavePoint(newIndex);
        let oldPoint = this.getWavePoint(oldIndex);

        this.wavePoints[oldIndex] = newPoint;

        for(let i = oldIndex+1; i < this.wavePoints.length; i++){
            let temp = oldPoint;
            oldPoint = this.wavePoints[i];
            this.wavePoints[i] = temp;
        }

        this.wavePoints[newIndex] = oldPoint;

        this.updatePathList();
    }
}
exports.FlightPathWithWavePoints = FlightPathWithWavePoints