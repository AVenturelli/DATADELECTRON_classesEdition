class WayPoint {

    #latLng
    #alt
    #map
    #flightPath;
    #marker;
    #currentDragLatLng;
    #markerColor = 'red';
    constructor(latLng,map) {
        this.#map = map;
        this.#latLng = latLng;
        this.#alt = $('#travelAltitude').val()
    }

    getLatLngPosition(){
        return this.#latLng
    }

    setWayPointAltitude(altInMeters){
        this.#alt = altInMeters;
    }

    getWayPointAltitude(){
        return this.#alt;
    }
    updatePosition(latLng){
        this.#latLng = latLng;
    }

    updatePositionAndAlt(latLng,alt){
        this.#latLng = latLng;
        this.#alt = alt;
    }

    updateMarker(){

        let redMarker = L.AwesomeMarkers.icon({
            icon: 'house',
            markerColor: this.#markerColor
        });

        this.#marker = L.marker(this.#latLng, {icon: redMarker,draggable: true}).addTo(this.#map);

    }

    getMarker(){
        return this.#marker
    }

    deleteMarker(){
        if(this.#map !== undefined && this.#marker !== undefined){
            this.#map.removeLayer(this.#marker)
        }
    }

    setMarkerGreen(){
        this.#markerColor = 'green'
    }

    setMarkerRed(){
        this.#markerColor = 'red'
    }

}

exports.WayPoint = WayPoint;