//Classe con tutti i dati di volo!!!
 class FlightData {
    static planeLatitude = 0;
    static planeLongitude = 0;
    static planeAltitude = 0;
    static planeDeltaAltitude = 50;
    static planePitch =0;
    static planeRoll = 0;
    static planeHeading = 0;
    static planeRollSpeed = 0
    static planePitchSpeed = 0
    static planeHeadingSpeed = 0
    static acceleration = 0;
    static maxAcceleration = 0;
    static vibration = undefined;
    static groundSpeed = undefined;
    static airSpeed = undefined;
    static atmosphericPressure = undefined
    static paramList = new Map();
    static currentBatteryVoltage;
    
    static rssi;
    
    static currentBattery = undefined;

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
