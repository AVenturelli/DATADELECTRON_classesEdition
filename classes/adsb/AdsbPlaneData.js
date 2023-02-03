class AdsbPlaneData {
    #adsbPlaneLatitude
    #adsbPlaneLongitude
    #adsbPlaneAltitude
    #adsbPlaneOrientation
    #adsbPlaneCallsign
    #adsbPlaneICAO
    #adsbPlaneHeading
    #adsbPlaneTimeLastUpdate

    //Per istanziare un plano è necessario avere almeno l'ICAO per renderlo univoco
    constructor(ICAO) {
        this.#adsbPlaneICAO = ICAO
    }

    get adsbPlaneHeading() {
        return this.#adsbPlaneHeading;
    }

    set adsbPlaneHeading(value) {
        this.#adsbPlaneHeading = value;
    }

    get adsbPlaneTimeLastUpdate() {
        return this.#adsbPlaneTimeLastUpdate;
    }

    set adsbPlaneTimeLastUpdate(value) {
        this.#adsbPlaneTimeLastUpdate = value;
    }

    get adsbPlaneLatitude() {
        return this.#adsbPlaneLatitude;
    }

    set adsbPlaneLatitude(value) {
        this.#adsbPlaneLatitude = value;
    }

    get adsbPlaneLongitude() {
        return this.#adsbPlaneLongitude;
    }

    set adsbPlaneLongitude(value) {
        this.#adsbPlaneLongitude = value;
    }

    get adsbPlaneAltitude() {
        return this.#adsbPlaneAltitude;
    }

    set adsbPlaneAltitude(value) {
        this.#adsbPlaneAltitude = value;
    }

    get adsbPlaneOrientation() {
        return this.#adsbPlaneHeading;
    }

    set adsbPlaneOrientation(value) {
        this.#adsbPlaneHeading = value;
    }

    get adsbPlaneCallsign() {
        return this.#adsbPlaneCallsign;
    }

    set adsbPlaneCallsign(value) {
        this.#adsbPlaneCallsign = value;
    }

    get adsbPlaneICAO() {
        return this.#adsbPlaneICAO;
    }
}

exports.AdsbPlaneData = AdsbPlaneData;
