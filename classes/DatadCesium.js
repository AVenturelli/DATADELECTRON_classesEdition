const Cesium = require("cesium");
const AdsbPlaneList = require("./adsb/AdsbPlaneList").AdsbPlaneList;
const JQueryRender = require("./renderData/JQueryRender").JQueryRender;
const Settings = require("./utility/Settings").Settings;

const FlightStateFirstPerson = require('./flightStates/FlightStateFirstPerson').FlightStateFirstPerson;
const FlightStateThirdPerson = require('./flightStates/FlightStateThirdPerson').FlightStateThirdPerson;

class DatadCesium{

    constructor() {
    }

    static #viewer
    static #currentView = 'first';
    static #currentConnection = null;
    static #currentConnectionUndefined = true;
    static #firstPersonView
    static #thirdPersonView
    static #currentFlightState
    static #renderLoopState = true;

    static #dataInterval = undefined;

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
                    this.stopDataInterval()
                } else if (this.#currentView === 'first') {
                    this.#currentFlightState = this.#firstPersonView;
                } else {
                    this.#currentFlightState = this.#thirdPersonView;
                }
            }

            let result = this.#currentFlightState.doFlight()


            if(!result){
                new CustomAlert("navValuesNotValid","Dati di navigazione non validi","Attenzione: i dati di navigazione inseriti non sono validi!")
                this.#renderLoopState = false;
            }

            //Mostro altimetro, spiiidometro e bussolo, prima e 3za persona
            if(this.#currentConnection !== undefined) {
                $('speedCanvas').show()
                $('altitudeCanvas').show()
                $('myCanvas').show()
                $('firstPerson').show()
                $('thirdPerson').show()
            }
            else {
                $('speedCanvas').hide()
                $('altitudeCanvas').hide()
                $('myCanvas').hide()
                $('firstPerson').hide()
                $('thirdPerson').hide()
            }
        }

        //Creo loop data
        this.#dataInterval = setInterval(() => {
            //Aggiorno tutti i contatori
            JQueryRender.updateSingleData();

            //Controllo gli aerei ADSB
            //AdsbPlaneList.createCheckLoop();

            //Aggiorno tutti i contatori
            JQueryRender.updateSingleData();

        },16)

        this.#viewer.scene.preRender.addEventListener(listener);
    }

    static stopDataInterval(){
        if(this.#dataInterval !== undefined){
            clearInterval(this.#dataInterval)
        }
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
        this.#thirdPersonView = new FlightStateThirdPerson(this.#viewer);
        this.#currentFlightState = this.#firstPersonView;

        this.#createListeners()
    }

    static #createListeners(){
        //Creo listener per prima persona
        $('#firstPerson').on('click',() => {
            this.#currentFlightState.removePlaneFromViewer();
            this.#currentFlightState = this.#firstPersonView

            $('#firstPerson').css('border-color', 'lightcoral');
            $('#firstPerson').css('cursor', 'not-allowed');

            $('#thirdPerson').css('border-color', 'lightgray');
            $('#thirdPerson').css('cursor', 'pointer');
        })
        //Creo listener per terza persona
        $('#thirdPerson').on('click',() => {
            this.#currentFlightState = this.#thirdPersonView
            this.#currentFlightState.createPlane();
            $('#thirdPerson').css('border-color', 'lightcoral');
            $('#thirdPerson').css('cursor', 'not-allowed');

            $('#firstPerson').css('border-color', 'lightgray');
            $('#firstPerson').css('cursor', 'pointer');
        })
    }
}

exports.DatadCesium = DatadCesium;