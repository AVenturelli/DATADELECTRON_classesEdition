    const Cesium = require("cesium");
const FlightData = require("../dataReader/FlightData").FlightData;
const FlightStateInterface = require('./FlightStateInterface').FlightStateInterface;

class FlightStateFirstPerson extends FlightStateInterface{

    camera = null;
    zeroTerrainLoop = 0;

    constructor(camera){
        super();
        //per ora non gli passo niente se non l'oggetto camera
        this.camera = camera;
        new FlightData();
    }
    
    async doFlight() {
    
        if (FlightData.navigationalValuesValid()) {
            this.updateCamera();
        }
    }
    
    updateCamera(){

        let longitude = FlightData.planeLongitude
        let latidude = FlightData.planeLatitude
        let alt = FlightData.planeAltitude;
        let heading = FlightData.planeHeading;

        if(longitude === 0 || latidude === 0){
            longitude = Settings.getData('startingLongitude')
            latidude = Settings.getData('statingLatitude')
            alt = Settings.getData('startingAltitude')
            if(heading === 0){
                heading = Settings.getData('startingHeading')
            }
        }
        
        
        
        this.camera.setView({
            destination : Cesium.Cartesian3.fromDegrees(
                longitude,
                latidude,
                alt+FlightData.planeDeltaAltitude
            ),
            orientation : {
                heading : this.getRadianAngle(heading),
                pitch : this.getRadianAngle(FlightData.planePitch),
                roll : this.getRadianAngle(FlightData.planeRoll)
            },
        });
    }
    
    returnToBaseView() {
        super.returnToBaseView(this.camera);
    }

    getRadianAngle(degreeValue) {
        return degreeValue * Math.PI / 180;
    }
}

exports.FlightStateFirstPerson = FlightStateFirstPerson;
