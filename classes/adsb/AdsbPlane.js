const Cesium = require("cesium");
const JQueryAdsbListManager = require("../renderData/JQueryAdsbListManager").JQueryAdsbListManager;

class AdsbPlane {

    #adsbData
    #adsbPlaneEntity
    #viewer
    #adsbPlaneTimeLastUpdate = undefined
    #status = false
    #text = ""
    constructor(adsbData,viewer) {
        this.#adsbData = (adsbData.ICAO());
        this.#viewer = viewer;
        this.#adsbPlaneTimeLastUpdate = new Date();
        this.#status = false
        this.#startPlaneInterval();
        this.#createText();
    }

    #createText(){

        let text
        if(this.#adsbData.adsbPlaneCallsign() === "" || this.#adsbData.adsbPlaneCallsign() === undefined)
        {
            text = "ICAO: "+ this.#adsbData.adsbPlaneICAO()
        }
        else
        {
            text = "Callsign: "+ this.#adsbData.adsbPlaneCallsign().trim()
        }

        //Aggiungo la quota all'aeare trovato
        if( this.#adsbData.adsbPlaneAltitude() !== undefined)
        {
            text += ", "+this.#adsbData.adsbPlaneAltitude()+" mt"
        }

        this.#text = text
    }

    getICAO(){
       return this.#adsbData.adsbPlaneICAO()
    }

    async addAdsbPlaneToMap() {

        let adsbResource = await Cesium.IonResource.fromAssetId(966921);

        this.#adsbPlaneEntity = this.#viewer.entities.add
            ({
                path: {
                    leadTime: 0,
                    trailTime: 3 * 60
                },
                position: Cesium.Cartesian3.fromDegrees(
                    this.#adsbData.adsbPlaneLongitude() / 10000000,
                    this.#adsbData.adsbPlaneLatitude() / 10000000,
                    this.#adsbData.adsbPlaneAltitude()
                ),
                model: {
                    scale: 1,
                    uri: adsbResource,
                    minimumPixelSize: 64,
                },
                label: {
                    text: this.#adsbData.callsign + "\n" + this.#adsbData.altitude + " mt",
                    font: '20px sans-serif',
                    //color: Cesium.Color.DARKORANGE,
                    showBackground: true,
                    horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
                    pixelOffset: new Cesium.Cartesian2(0.0, -20),
                    pixelOffsetScaleByDistance: new Cesium.NearFarScalar(1.5e2, 3.0, 1.5e7, 0.5)
                }
            });

        //Creo l'aereo anche nella lista
        JQueryAdsbListManager.addToList(this.#adsbData.adsbPlaneICAO,this.#text)

    }

    updatePlanePosition(adsbData){
        this.#adsbData = adsbData;
        this.#updatePlaneEntity();
        JQueryAdsbListManager.update(this.#adsbData.adsbPlaneICAO,this.#text)

    }

    #updatePlaneEntity(){

        let planeNewHeading = new Cesium.HeadingPitchRoll(
            (this.#adsbData.heading-90)*Math.PI/180,
            0,
            0
        );

        let planeNewPosition = Cesium.Cartesian3.fromDegrees(
            this.#adsbData.adsbPlaneLongitude() / 10000000,
            this.#adsbData.adsbPlaneLatitude() / 10000000,
            this.#adsbData.adsbPlaneAltitude()
        )

        this.#adsbPlaneEntity.orientation =  Cesium.Transforms.headingPitchRollQuaternion(planeNewPosition,planeNewHeading)
        this.#adsbPlaneEntity.position =  planeNewPosition
        this.#adsbPlaneEntity.label.text = this.#text

        this.#adsbPlaneTimeLastUpdate = new Date();
        this.#status = true;
    }

    removeAdsbPlaneEntity(plane_entity){
        this.#viewer.entities.remove(plane_entity);
        JQueryAdsbListManager.removeFromList(this.#adsbData.adsbPlaneICAO)
    }

    #startPlaneInterval(){
        //Ogni quindici secondi controllo che non sia scaduto!
        setInterval(() =>{
            let now = new Date();
            if((now.getTime() - this.#adsbPlaneTimeLastUpdate.getTime()) > 15000){
                this.#status = false
            }
        },2000)
    }

    get status(){
        return this.#status
    }
}

exports.AdsbPlane = AdsbPlane;
