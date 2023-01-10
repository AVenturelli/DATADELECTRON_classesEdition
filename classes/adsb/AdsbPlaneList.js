const AdsbPlane = require("./AdsbPlane").AdsbPlane;

class AdsbPlaneList {
    static #planeList = new Map();
    #viewer
    constructor(viewer) {
        this.#viewer = viewer

    }

    #addAdsbPlaneToList(adsbData){
        let newAdsbPlane = new AdsbPlane(adsbData,this.#viewer);
        newAdsbPlane.addAdsbPlaneToMap().then(r => this.#planeList.add(newAdsbPlane));
    }

    static updatePlaneData(newAdsbPlaneData){

        let localIcaoList = this.getICAOList(this.#planeList);

        //Aggiungo l'aereo se non c'è
        if(!localIcaoList.includes(newAdsbPlaneData.adsbPlaneICAO())) {
            this.#addAdsbPlaneToList(newAdsbPlaneData);
        }

        //Controllo gli aerei già presenti
        for (let adsbPlane in this.#planeList)
        {
            if (adsbPlane.getICAO().equals(newAdsbPlaneData.adsbPlaneICAO())) {
                adsbPlane.updatePlanePosition(newAdsbPlaneData)
                break;
            }
        }
    }

    #removePlaneFromAdsbList(adsbPlane){

        adsbPlane.removeAdsbPlaneEntity();
        const index = this.#planeList.indexOf(adsbPlane);
        if (index > -1) { // only splice array when item is found
            this.#planeList.splice(index, 1); // 2nd parameter means remove one item only
        }

    }

    static getICAOList(adsbPlanesData) {
        let icaoList = [];

        for(let planeData in adsbPlanesData){
            icaoList.add(planeData.getICAO());
        }
        return icaoList;
    }

    static createCheckLoop(){
        setInterval(() => {
            for(let i in this.#planeList){
                if(!i.status()){
                    this.#removePlaneFromAdsbList(i)
                }
            }
        },2000);

    }
}

exports.AdsbPlaneList = AdsbPlaneList;
