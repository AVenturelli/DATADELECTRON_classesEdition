const Cesium = require("cesium");
const FlightData = require("../dataReader/FlightData").FlightData;
const FlightStateInterface = require('./FlightStateInterface').FlightStateInterface;

// noinspection JSUnusedGlobalSymbols,JSCheckFunctionSignatures
class FlightStateThirdPerson extends FlightStateInterface{

    camera = null;
    viewer = null
    planeEntity = undefined;
    
    zeroTerrainLoop = 0;

    constructor(viewer){
        super();
        this.camera = viewer.camera;
        this.viewer = viewer;
    }

    async doFlight() {
        if (FlightData.navigationalValuesValid()) {
            this.updateCamera();
        }
    }

    getRadianAngle(degreeValue) {
        return degreeValue * Math.PI / 180;
    }

    updateCamera(){

        let longitude = FlightData.planeLongitude
        let latitude = FlightData.planeLatitude
        let alt = FlightData.planeAltitude
        let heading = FlightData.planeHeading;

        if(longitude === 0 || latitude === 0) {
            longitude = Settings.getData('startingLongitude')
            latitude = Settings.getData('statingLatitude')
            alt = Settings.getData('startingAltitude')
            if(heading === 0) {
                heading = Settings.getData('startingHeading')
            }
        }

        let currentHeadingPitchRoll = new Cesium.HeadingPitchRoll(
            this.getRadianAngle(heading),
            this.getRadianAngle(-FlightData.planeRoll),
            this.getRadianAngle(FlightData.planePitch)
        )

        let currentPlanePositionCartesian3 = Cesium.Cartesian3.fromDegrees(
            longitude,
            latitude,
            alt+FlightData.planeDeltaAltitude)

        if(this.planeEntity !== undefined) {
            this.planeEntity.orientation = Cesium.Transforms.headingPitchRollQuaternion(
                currentPlanePositionCartesian3,currentHeadingPitchRoll
            )
            this.planeEntity.position = currentPlanePositionCartesian3
            this.viewer.trackedEntity = this.planeEntity
        }
    }


    async createPlane(){
        
        if (this.planeEntity === undefined) {
            let planeAssets = await Cesium.IonResource.fromAssetId(Settings.getData('planeAssetId'));
            this.planeEntity = this.viewer.entities.add({
                path: {
                    leadTime: 0,
                    trailTime: 3 * 60
                },
                position: Cesium.Cartesian3.fromDegrees(
                    FlightData.planeLongitude,
                    FlightData.planeLatitude,
                    FlightData.planeAltitude + FlightData.planeDeltaAltitude),
                model: {
                    scale: 1,
                    uri: planeAssets,
                    minimumPixelSize: 128,
                },
            });
        }
    }

    returnToBaseView() {
        this.removePlaneFromViewer();
        super.returnToBaseView(this.camera);
    }

    removePlaneFromViewer(){
        if(this.planeEntity !== null){
            this.viewer.entities.remove(this.planeEntity);
            this.planeEntity = undefined;
        }
    }
    
 
}

exports.FlightStateThirdPerson = FlightStateThirdPerson;
