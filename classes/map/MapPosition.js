class MapPosition {

    static map = undefined;
    static planeImg = "./assets/img/jet-plane-svgrepo-com.svg"

    static showTrail = true;
    static plane = undefined;
    static planeLocked = true;
    static trailPoints = undefined;

    static oldLat = undefined;
    static oldLon = undefined;

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

        /*let index = 0;
        setInterval(()=>{
            if(index%10 === 0){
                //index = 0;
                yCoord+=0.00001;
            }
            if(index!== 0 && index%100 === 0){
                yCoord-=0.0002;
            }
            this.render(yCoord,xCoord)
            //this.addPointToTrail(yCoord,xCoord);
            xCoord+=0.00001;
            index++;
        },10)*/


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

    static addPointToTrail(lat,lon){
        if(this.trailPoints === undefined){
            this.trailPoints = L.polyline([[lat,lon]], {color: 'red'}).addTo(this.map);
        }
        else {
            this.trailPoints.addLatLng([lat,lon])
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

        let imageBounds = [[yCoord-0.000100, xCoord-0.000100], [yCoord+0.000100, xCoord+0.000100]]

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
}

exports.MapPosition = MapPosition;