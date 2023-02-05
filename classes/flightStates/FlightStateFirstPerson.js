    const Cesium = require("cesium");
const FlightData = require("../dataReader/FlightData").FlightData;
const FlightStateInterface = require('./FlightStateInterface').FlightStateInterface;

class FlightStateFirstPerson extends FlightStateInterface{

    camera = null;

    constructor(camera){
        super();
        //per ora non gli passo niente se non l'oggetto camera
        this.camera = camera;
        new FlightData();
    }
    doFlight(){

        if(FlightData.navigationalValuesValid()){
            this.updateCamera();
        }
        else{
            //TODO ci metterò un avviso!
        }
    }
    updateCamera(){
        this.camera.setView({
            destination : Cesium.Cartesian3.fromDegrees(
                FlightData.planeLongitude,
                FlightData.planeLatitude,
                FlightData.planeAltitude+FlightData.planeDeltaAltitude
            ),
            orientation : {
                heading : this.getRadianAngle(FlightData.planeHeading),
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
