const Cesium = require("cesium");
const AdsbPlaneList = require("./adsb/AdsbPlaneList").AdsbPlaneList;
const JQueryRender = require("./renderData/JQueryRender").JQueryRender;
const Settings = require("./utility/Settings").Settings;

const FlightStateFirstPerson = require('./flightStates/FlightStateFirstPerson').FlightStateFirstPerson;
const FlightStateThirdPerson = require('./flightStates/FlightStateThirdPerson').FlightStateThirdPerson;

class DatadCesium{

    static #viewer
    static #currentView = 'first';
    static #currentConnection = null;
    static #currentConnectionUndefined = true;
    static #firstPersonView
    static #thirdPersonView
    static #currentFlightState
    static #renderLoopState = true;

    static changeRenderLoopState(state){
        this.#renderLoopState = state
    }

    static async createEverything(){
        await this.#doBaseInitialization();
    }

    static startRenderLoop() {
        let listener = () => {

            if(this.#renderLoopState) {
                if (this.#currentConnection === undefined && this.#currentConnectionUndefined !== true) {
                    this.#currentFlightState.returnToBaseView()
                } else if (this.#currentView === 'first') {
                    this.#currentFlightState = this.#firstPersonView;
                } else {
                    this.#currentFlightState = this.#thirdPersonView;
                }
            }

            this.#currentFlightState.doFlight()

            //Aggiorno tutti i contatori
            JQueryRender.updateSingleData();

            //Controllo gli aerei ADSB
            AdsbPlaneList.createCheckLoop();
        }

        this.#viewer.scene.preRender.addEventListener(listener);
    }

    static #doBaseInitialization(){
        // Initialize the Cesium Viewer in the HTML element with the `cesiumContainer` ID.
        Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI0M2JiZWQxOC05MjU4LTQyNWEtOTVhZS1kYTdlYmQyNDM3OTgiLCJpZCI6Mzc4NDAsImlhdCI6MTYxMjExMDg4Nn0.XETK0J9tqK0IS1KV6kJz4LFBJs8Vn4FmBtz0JfE8v60';

        this.#viewer = new Cesium.Viewer('cesiumContainer', {
            terrainProvider: Cesium.createWorldTerrain()
        });
        // Add Cesium OSM Buildings, a global 3D buildings layer.
        this.#viewer.scene.primitives.add(Cesium.createOsmBuildings());

        // Fly the camera to Modena at the given longitude, latitude, and height.
        this.#viewer.camera.flyTo({
            destination : Cesium.Cartesian3.fromDegrees(
                Settings.getData("startingLongitude"),
                Settings.getData("statingLatitude"),
                Settings.getData("startingAltitude")
            ),
            orientation : {
                heading : Cesium.Math.toRadians(Settings.getData("startingHeading")),
                pitch : Cesium.Math.toRadians(0),
            },
        });


        this.#viewer.scene.debugShowFramesPerSecond = true;

        this.#firstPersonView = new FlightStateFirstPerson(this.#viewer.camera);
        this.#thirdPersonView = new FlightStateThirdPerson(this.#viewer.camera);

        this.#currentFlightState = this.#firstPersonView;
    }
}

exports.DatadCesium = DatadCesium;

/*function changeTopView()
{
    top_view = true;
    third_person = false;
    
    if(globalThis.plano !== undefined)
    {
        viewer.entities.remove(plane_entity);
        globalThis.plane_entity = undefined;
        globalThis.plano = undefined;
    }
    set_plane()
    globalThis.first_person = false;
    $("#zoommatoio").show('fast')
}*/



/*function changeThirdPerson()
{
    top_view = true;
    third_person = true;
    
    if(globalThis.plano !== undefined)
    {
        viewer.entities.remove(plane_entity);
        globalThis.plane_entity = undefined;
        globalThis.plano = undefined;
    }

    set_plane()
    globalThis.first_person = false;
    $("#zoommatoio").hide('fast')
    $('#select_view').val('third_person_view')
    //Metto le tettolone
    $('#tettolone_container').show();
    //Tolgo i display
    $('#gauges').hide('fast')
}*/