//Classe con tutti i dati di volo!!!
 class FlightData {
    static planeLatitude = undefined;
    static planeLongitude = undefined;
    static planeAltitude = undefined;
    static planeDeltaAltitude = undefined;
    static planePitch = undefined;
    static planeRoll = undefined;
    static planeHeading = undefined;
    static planeRollSpeed = undefined
    static planePitchSpeed = undefined
    static planeHeadingSpeed = undefined
    static acceleration = undefined;
    static maxAcceleration = undefined;
    static vibration = undefined;
    static groundSpeed = undefined;
    static airSpeed = undefined;
    static atmosphericPressure = undefined
    static paramList = new Map();

    static constructor() {
        if (this instanceof FlightData) {
            throw Error('A static class cannot be instantiated.');
        }
    }

    //Se i valori di navigazione sono settati ritorno vero
    //WARNING: se non va il gps non mi funziona neanche il resto,
    //bisognerà dividere i due valori
    static navigationalValuesValid(){
        return this.planeRoll !== undefined &&
            this.planePitch !== undefined &&
            this.planeAltitude !== undefined &&
            this.planeLatitude !== undefined &&
            this.planeLongitude !== undefined &&
            this.planeHeading !== undefined;
    }
}

exports.FlightData = FlightData;
