class MapPosition {

    static map = undefined;
    static planeImg = "./assets/img/jet-plane-svgrepo-com.svg"

    static plane = undefined;
    constructor() {
    }

    static setUp(){

        const yCoord = 44.647129;
        const xCoord = 10.925227;
        const deg = Settings.getData('startingHeading')

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

        /*const polygon = L.polygon([
           [51.509, -0.08],
           [51.503, -0.06],
           [51.51, -0.047]
       ]).addTo(map).bindPopup('I am a polygon.');*/


        /*const popup = L.popup()
            .setLatLng([51.513, -0.09])
            .setContent('I am a standalone popup.')
            .openOn(map);

        function onMapClick(e) {
            L.popup()
                .setLatLng(e.latlng)
                .setContent(`You clicked the map at ${e.latlng.toString()}`)
                .openOn(map);
        }

        map.on('click', onMapClick);
         */
    }

    static setHome(){
        //TODO cliccando sulla mappa setti la home dell'aereoplano
    }

    static addPoint(){
        //TODO in futuro cliccando sulla mappa puoi aggiungere un punto sul navigatore del plano
    }



    static render() {

        let yCoord = FlightData.planeLatitude;
        let xCoord = FlightData.planeLongitude;
        const deg = FlightData.planeHeading;

        if(yCoord === 0 || yCoord === undefined){yCoord=44.647129}
        if(xCoord === 0 || xCoord === undefined){xCoord=10.925227}

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

        let imageBounds = [[yCoord-0.000100, xCoord-0.000100], [yCoord+0.000100, xCoord+0.000100]]

        this.plane.reposition(topLeft, topRight, bottomLeft)

        console.log(topLeft)

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
}

exports.MapPosition = MapPosition;