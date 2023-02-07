class WavePoint {

    #latLng
    #alt
    #map
    #flightPath;
    #marker;
    #currentDragLatLng;
    constructor(latLng,map) {
        this.#map = map;
        this.#latLng = latLng;
    }

    getLatLngPosition(){
        return this.#latLng
    }

    setWavePointAltitude(altInMeters){
        this.#alt = altInMeters;
    }

    updatePosition(latLng){
        this.#latLng = latLng;
    }

    updateMarker(){

        let redMarker = L.AwesomeMarkers.icon({
            icon: 'house',
            markerColor: 'red'
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
}

exports.WavePoint = WavePoint;