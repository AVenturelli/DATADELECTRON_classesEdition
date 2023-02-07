const WavePointManager = require("./WavePointManager").WavePointManager;
const FlightPath = require('./FlightPathWithWavePoints').FlightPathWithWavePoints;
class MapPosition {

    static map = undefined;
    static planeImg = "./assets/img/jet-plane-svgrepo-com.svg"
    static homeImg = "./assets/img/home-svgrepo-com.svg"

    static showTrail = true;
    static plane = undefined;
    static planeLocked = true;
    static trailPoints = undefined;

    static oldLat = undefined;
    static oldLon = undefined;
    static home = undefined;
    static homeCoords = undefined;

    static flightPathData = undefined;

    constructor() {
    }

    static setUp(){

        let yCoord = Settings.getData('statingLatitude');
        let xCoord = Settings.getData('startingLongitude')
        let deg = Settings.getData('startingHeading')

        this.map = L.map('map').setView([yCoord, xCoord], 19);

        const googleSat = L.tileLayer('https://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',{
            maxZoom: 20,
            subdomains:['mt0','mt1','mt2','mt3']
        }).addTo(this.map)


        let dimValues = this.getZoom();

        let centerX = xCoord;
        let centerY = yCoord;

        let leftUpperCorner_x = xCoord-dimValues;
        let leftUpperCorner_y = yCoord+dimValues;

        let rightUpperCorner_x = xCoord+dimValues;
        let rightUpperCorner_y = yCoord+dimValues;

        let leftBottomCorner_x = xCoord-dimValues;
        let leftBottomCorner_y = yCoord-dimValues;

        let rotation = 90;

        let topLeft = this.rotate(centerX,centerY,leftUpperCorner_x,leftUpperCorner_y,deg);
        let topRight = this.rotate(centerX,centerY,rightUpperCorner_x,rightUpperCorner_y,deg);
        let bottomLeft = this.rotate(centerX,centerY,leftBottomCorner_x,leftBottomCorner_y,deg);

        let imageBounds = [[yCoord-0.000100, xCoord-0.000100], [yCoord+0.000100, xCoord+0.000100]]
        this.plane = L.imageOverlay.rotated(this.planeImg, topLeft, topRight, bottomLeft).addTo(this.map);


        $('#trailMap').on('change',()=>{
            this.showTrail = $('#trailMap').val() !== '0';
        })

        $('#planeLocked').on('change',()=>{
            this.planeLocked = $('#planeLocked').val() !== '0';
        })

        $('#mapPathDelete').on('click',()=>{
            this.removeAllTrailPoints()
        })

        this.map.on('click', (e) =>{

            let doPopUp = true;
            if(this.homeCoords !== undefined){
                let dimValues = this.getZoom()/2;
                let imageBounds = [[this.homeCoords[0]-dimValues, this.homeCoords[1]-dimValues], [this.homeCoords[0]+dimValues, this.homeCoords[1]+dimValues]]

                if(e.latlng.lat > imageBounds[0][0] && e.latlng.lat <  imageBounds[1][0] && e.latlng.lng > imageBounds[0][1] && e.latlng.lng < imageBounds[1][1]){
                    //Sono sopra la casa!!
                    doPopUp = false;
                }

                let markerPositions = FlightPath.getMarkersPosition()

                let marker = undefined;

                for(let i = 0; i < markerPositions.length; i++){
                    let imageBounds = [
                        [
                            markerPositions[i].lat-dimValues, markerPositions[i].lng-dimValues
                        ],
                        [
                            markerPositions[i].lat+dimValues, markerPositions[i].lng+dimValues
                        ]]

                    if(e.latlng.lat > imageBounds[0][0] && e.latlng.lat <  imageBounds[1][0] && e.latlng.lng > imageBounds[0][1] && e.latlng.lng < imageBounds[1][1]){
                        //Sono sopra la casa!!
                        doPopUp = false;
                        marker = markerPositions[i];
                    }
                }


                if(doPopUp){
                    let html = "<div style='margin-top: 5px'><strong >Click here to add to the plane's path</strong></div><div style='width: 100%;font-weight: 600' id='addToPath' data-lat='"+e.latlng.lat+"' data-lon='"+e.latlng.lng+"' class='btn btn-info btn-small'>ADD TO PATH</div>"
                    L.popup().setLatLng(e.latlng).setContent(html).openOn(this.map);
                }
                else{
                    //Sono sopra ad un marker!
                    let html = "<div style='margin-top: 5px'><strong >Click here to remove the marker</strong></div><div style='width: 100%;font-weight: 600' id='removeMarker' data-lat='"+marker.lat+"' data-lon='"+marker.lng+"' class='btn btn-warning btn-small'>REMOVE MARKER</div>"
                    L.popup().setLatLng(e.latlng).setContent(html).openOn(this.map);
                }

            }else{
                let html = "<div style='margin-top: 5px'><strong >Click here to set the plane's home</strong></div><div style='width: 100%;font-weight: 600' id='setHomeFromMap' data-lat='"+e.latlng.lat+"' data-lon='"+e.latlng.lng+"' class='btn btn-warning btn-small'>SET HOME</div>"
                L.popup().setLatLng(e.latlng).setContent(html).openOn(this.map);
            }

        });

        //Serve per aggiornare il modal con i wavepoint quando trascino da mappa
        $(document).on('mouseup', '.awesome-marker', () => {
            WavePointManager.populateWavePoints();
        })

        $(document).on('click', '#removeMarker',() => {
            let lat = $('#removeMarker').data('lat')
            let lon = $('#removeMarker').data('lon')
            /*let alert = new CustomAlert(
                'planeHomeSetAndReceived',
                'Point Removed from FlightPath',
                'Il punto di coordinate Lat: '+Math.round(lat*100000)/100000+" e Lon: "+Math.round(lon*100000)/100000+" è stato rimosso dal piano di volo.");
            alert.printCode()
            alert.showAlert();*/

            FlightPath.removePoint(L.latLng(lat,lon))

            $('.leaflet-popup-close-button').children('span').trigger('click')

            WavePointManager.showTabWavepoints();
        })


        $(document).on('click', '#addToPath',() =>{
            let lat = $('#addToPath').data('lat')
            let lon = $('#addToPath').data('lon')
            /*let alert = new CustomAlert(
                'planeHomeSetAndReceived',
                'Point Added to FlightPath',
                'Il punto di coordinate Lat: '+Math.round(lat*100000)/100000+" e Lon: "+Math.round(lon*100000)/100000+" è stato aggiunto al piano di volo.");
            alert.printCode()
            alert.showAlert();*/

            FlightPath.addPoint(L.latLng(lat,lon))

            WavePointManager.showTabWavepoints();

            $('.leaflet-popup-close-button').children('span').trigger('click')
        })

        $(document).on('click', '#setHomeFromMap',() =>{

            let lat = $('#setHomeFromMap').data('lat')
            let lon = $('#setHomeFromMap').data('lon')
            /*let alert = new CustomAlert(
                'planeHomeSetAndReceived',
                'Plane Home set correctly (Ti piacerebbe)',
                'La home è stata impostata correttamente alle coordinate Lat: '+Math.round(lat*100000)/100000+" e Lon: "+Math.round(lon*100000)/100000);
            alert.printCode()
            alert.showAlert();*/

            this.homeCoords = [lat,lon];

            //Metto la home nel flight path!
            FlightPath.setStatingPoint(lat,lon,this.map)

            this.drawHome();

            $('.leaflet-popup-close-button').children('span').trigger('click')

            WavePointManager.showTabWavepoints();

        })

        $(document).on('click', '#removeHome',() =>{

            let alert = new CustomAlert(
                'planeHomeSetAndReceived',
                'Plane Home removed correctly (Ti piacerebbe)',
                'La home è stata rimossa correttamente dalle coordinate Lat: '+Math.round(this.homeCoords[1]*100000)/100000+" e Lon: "+Math.round(this.homeCoords[0]*100000)/100000+" e il path è stato cancellato.");
            alert.printCode()
            alert.showAlert();

            $('.leaflet-popup-close-button').children('span').trigger('click')

            this.map.removeLayer(this.home);
            this.home = undefined;
            this.homeCoords = undefined;

            //Tolgo la home dal flight path e lo cancello!
            FlightPath.clearPath()

            WavePointManager.showTabWavepoints();
        })

        this.map.on('zoomend',()=>{
            this.drawHome();
        })


    }

    static getHomeCoords(){
        return this.homeCoords;
    }

    static drawHome(){

        if(this.homeCoords  !== undefined){
            let dimValues = this.getZoom()/2;

            let imageBounds = [[this.homeCoords[0]-dimValues, this.homeCoords[1]-dimValues], [this.homeCoords[0]+dimValues, this.homeCoords[1]+dimValues]]
            if(this.home !== undefined){
                this.map.removeLayer(this.home)
            }
            this.home = L.imageOverlay(this.homeImg, imageBounds,{interactive: true}).addTo(this.map).on('click', (e) =>{
                console.log("ok")
                let html = "<div style='margin-top: 5px'><strong >Click here to remove the plane's home</strong></div><div style='width: 100%;font-weight: 600' id='removeHome' class='btn btn-danger btn-small'>REMOVE HOME</div>"
                L.popup()
                    .setLatLng(e.latlng)
                    .setContent(html)
                    .openOn(this.map);
            })
        }
    }

    static setHome(){
        //TODO cliccando sulla mappa setti la home dell'aereoplano
    }

    static addPoint(){
        //TODO in futuro cliccando sulla mappa puoi aggiungere un punto sul navigatore del plano
    }

    static addPointToTrail(lat,lon){
        if(this.trailPoints === undefined){
            this.trailPoints = L.polyline(L.latLng(lat,lon), {color: 'red'}).addTo(this.map);
        }
        else {
            this.trailPoints.addLatLng(L.latLng(lat,lon))
        }
    }

    static removeAllTrailPoints(){
        if(this.trailPoints !== undefined){
            this.map.removeLayer(this.trailPoints)
            this.trailPoints = undefined
        }
    }

    static render(/*yCoord,xCoord*/) {

        let yCoord = FlightData.planeLatitude;
        let xCoord = FlightData.planeLongitude;
        let deg = FlightData.planeHeading;

        if(yCoord === 0 || yCoord === undefined){
            yCoord=Settings.getData('statingLatitude')
            xCoord=Settings.getData('startingLongitude')
            deg = Settings.getData('startingHeading')
        }

        if(this.showTrail && this.oldLat !== yCoord && this.oldLon !== xCoord){
            this.addPointToTrail(yCoord,xCoord);
        }

        let dimValues = this.getZoom();

        let centerX = xCoord;
        let centerY = yCoord;

        let leftUpperCorner_x = xCoord-dimValues;
        let leftUpperCorner_y = yCoord+dimValues;

        let rightUpperCorner_x = xCoord+dimValues;
        let rightUpperCorner_y = yCoord+dimValues;

        let leftBottomCorner_x = xCoord-dimValues;
        let leftBottomCorner_y = yCoord-dimValues;

        let topLeft = this.rotate(centerX,centerY,leftUpperCorner_x,leftUpperCorner_y,deg);
        let topRight = this.rotate(centerX,centerY,rightUpperCorner_x,rightUpperCorner_y,deg);
        let bottomLeft = this.rotate(centerX,centerY,leftBottomCorner_x,leftBottomCorner_y,deg);

        this.plane.reposition(topLeft, topRight, bottomLeft)

        if(this.planeLocked){
            this.map.setView([yCoord, xCoord],  this.map._zoom);
        }

    }
    static rotate(centerX, centerY, x, y, angle) {
        let radians = (Math.PI / 180) * angle,
            cos = Math.cos(radians),
            sin = Math.sin(radians),
            nx = (cos * (x - centerX)) + (sin * (y - centerY)) + centerX,
            ny = (cos * (y - centerY)) - (sin * (x - centerX)) + centerY;
        return L.latLng(ny, nx);
    }

    static getZoom(){


        let zoom = this.map._zoom

        let dimValues;

        switch (zoom){
            case 20: dimValues = 0.000050; break;
            case 19: dimValues = 0.000100; break;
            case 18: dimValues = 0.000200; break;
            case 17: dimValues = 0.000400; break;
            case 16: dimValues = 0.000700; break;
            case 15: dimValues = 0.001200; break;
            case 14: dimValues = 0.002000; break;
            case 13: dimValues = 0.004000; break;
            case 12: dimValues = 0.007000; break;
            case 11: dimValues = 0.012000; break;
            case 10: dimValues = 0.02000; break;
            default: dimValues = 0.02;
        }
        return dimValues
    }

    static getMap() {
        console.log(this.map)
        return this.map;
    }
}

exports.MapPosition = MapPosition;