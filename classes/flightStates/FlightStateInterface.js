const Cesium = require("cesium");

class FlightStateInterface {

    returnToBaseView(camera) {
        camera.setView({
            destination : Cesium.Cartesian3.fromDegrees(
                10.923773,
                44.647036,
                120),
            orientation : {
                heading : Cesium.Math.toRadians(120),
                pitch : Cesium.Math.toRadians(0),
            },
        });
    }
    async zeroTerrain() {

        let positions = [
            Cesium.Cartographic.fromDegrees(
                FlightData.planeLongitude,
                FlightData.planeLatitude
            )
        ];

        try {
            let [updatedHeight] = await Promise.all([Cesium.sampleTerrain(viewer.terrainProvider, 12, positions)]);
            let newDelta = updatedHeight[0].height - FlightData.planeAltitude + FlightData.planeDeltaAltitude
            FlightData.planeDeltaAltitude(newDelta);
        } catch (error) {
            console.log(error)
        }
    }
}

exports.FlightStateInterface = FlightStateInterface;
