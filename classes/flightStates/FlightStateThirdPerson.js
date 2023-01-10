const FlightStateInterface = require('./FlightStateInterface').FlightStateInterface;
class FlightStateThirdPerson extends FlightStateInterface{

    camera = null;
    viewer = null
    planeEntity=null;

    constructor(viewer){
        super();
        //per ora non gli passo niente se non l'oggetto camera
        this.camera = viewer.camera;
        this.viewer = viewer;
    }

    doFlight(){

        if(FlightData.navigationalValuesValid()){
            if(this.planeEntity == null){

                this.createPlane().then(r => {
                    this.updateCamera()
                    super.zeroTerrain().then(r => {
                        console.log("Plane leveled")
                    });
                });

            }
            this.updateCamera();
        }
        else{
            //TODO ci metterò un avviso!
        }
    }

    updateCamera(){

        let currentHeadingPitchRoll = new Cesium.HeadingPitchRoll(
            FlightData.planeHeading,
            FlightData.planePitch,
            FlightData.planeRoll)

        let currentPlanePositionCartesian3 = Cesium.Cartesian3.fromDegrees(
            FlightData.planeLongitude,
            FlightData.planeLatitude,
            FlightData.planeAltitude+FlightData.planeDeltaAltitude)

        this.planeEntity.orientation = Cesium.Transforms.headingPitchRollQuaternion(
            currentPlanePositionCartesian3,currentHeadingPitchRoll
        )
        this.planeEntity.position = currentPlanePositionCartesian3

        this.viewer.trackedEntity = this.planeEntity
    }


    async createPlane(){
        //Creo il plano
        let planeAssets = await Cesium.IonResource.fromAssetId(449252);

        this.planeEntity = viewer.entities.add({
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

        this.viewer.trackedEntity = this.planeEntity
    }

    returnToBaseView()
    {
        this.removePlaneFromViewer();
        super.returnToBaseView(this.camera);
    }

    removePlaneFromViewer(){
        this.viewer.entities.remove(this.planeEntity);
        this.planeEntity = null;
    }
}

exports.FlightStateThirdPerson = FlightStateThirdPerson;
