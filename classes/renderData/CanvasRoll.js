const {FlightData} = require("../dataReader/FlightData");

class CanvasRoll {

    static #oldHeading = null;
    static #testaInGiu = false;
    constructor() {
    }


    static render(){

        let roll = -FlightData.planeRoll
        let heading = FlightData.planeHeading;
        let pitch = FlightData.planePitch;

        if(this.#oldHeading === null){this.#oldHeading = heading}
        if((this.#oldHeading !== null && this.#oldHeading - heading > 150 || this.#oldHeading - heading < -150)
            && (pitch > 88 || pitch < -88)){
            //Devo ruotare tutto!
            this.#testaInGiu = !this.#testaInGiu;
            this.#oldHeading = heading
        }



        let c = document.getElementById('rollCanvas')
        let ctx = c.getContext('2d');
        let textcTX = c.getContext('2d')
        //Linea principale
        ctx.beginPath();
        ctx.strokeStyle = 'white';

        ctx.clearRect(0, 0, c.width, c.height);

        //Creo le posizioni dei vari numeri
        //let deg = FlightData.planeHeading;
        // if (deg === undefined) deg = Settings.getData('startingHeading');
        //deg = Math.round(deg)

        //console.log(originalDe
        //this.roundRect(30, 180, 60, 40, 10, ctx);



        let height = 800
        let width = 1000;

        ctx.strokeStyle = "orange";
        ctx.lineWidth = "1";

        ctx.moveTo(498, 498)
        ctx.lineTo(502, 498)
        ctx.lineTo(502, 502)
        ctx.lineTo(498, 502)
        ctx.lineTo(498, 498)

        ctx.stroke()
        ctx.beginPath();

        //0
        ctx.moveTo(500, 100)
        ctx.lineTo(500, 170)

        //-90
        ctx.moveTo(100, 500)
        ctx.lineTo(170, 500)

        //90
        ctx.moveTo(900, 500)
        ctx.lineTo(830, 500)

        //45
        ctx.moveTo(733, 267)
        ctx.lineTo(783, 217)

        //-45
        ctx.moveTo(266.65, 266.65)
        ctx.lineTo(217, 217)


        //-60
        ctx.moveTo(153.58, 300)
        ctx.lineTo(214.21, 335)

        //-30
        ctx.moveTo(300, 153.58)
        ctx.lineTo(335, 214.21)

        //30
        ctx.moveTo(846.42, 300)
        ctx.lineTo(785.78, 335)

        //60
        ctx.moveTo(700, 153.58)
        ctx.lineTo(665, 214.21)

        ctx.stroke();

        let canvas = document.getElementById('horizonBarCanvas')
        ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.strokeStyle="yellow";
        ctx.lineWidth="5";

        ctx.fillStyle = "black";
        ctx.font = "bold 22px serif";

        ctx.moveTo(200,400)
        ctx.lineTo(400,400)

        ctx.moveTo(600,400)
        ctx.lineTo(800,400)

        ctx.moveTo(495,400)
        ctx.lineTo(505,400)
        ctx.stroke()
        ctx.beginPath()

        if(this.#testaInGiu){
            ctx.translate(ctx.canvas.width * 0.5, ctx.canvas.height * 0.5);    // center
            let oldRotation = this.getRotation(ctx)
            ctx.rotate(-oldRotation);
            ctx.rotate(this.getRadianAngle(roll+180));                                         // 90°
            ctx.translate(-ctx.canvas.width * 0.5, -ctx.canvas.height * 0.5);
        }
        else
        {
            ctx.translate(ctx.canvas.width * 0.5, ctx.canvas.height * 0.5);    // center
            let oldRotation = this.getRotation(ctx)
            ctx.rotate(-oldRotation);
            ctx.rotate(this.getRadianAngle(roll));                                         // 90°
            ctx.translate(-ctx.canvas.width * 0.5, -ctx.canvas.height * 0.5);
        }
    }
    static getRotation(ctx) {
        const mat = ctx.getTransform();
        const rad = Math.atan2(mat.b, mat.a);
        if (rad < 0) {
            // angle is > Math.PI
            return rad + Math.PI * 2;
        }
        return rad;
    }

    static getRadianAngle(degreeValue) {
        return degreeValue * Math.PI / 180;
    }
}
exports.CanvasRoll = CanvasRoll
