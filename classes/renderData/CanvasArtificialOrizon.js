class CanvasArtificialOrizon {

    static #oldHeading = null;
    static #testaInGiu = false;
    constructor() {
    }

    static render(){
        let canvas = document.getElementById('horizonCanvas')
        let ctx = canvas.getContext('2d');
        ctx.restore()
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        let baseSkyCoords = [[-1000, -800], [canvas.width + 2000, -800], [canvas.width + 2000, canvas.height / 2], [-1000, canvas.height]]
        let baseGroundCoords = [[-1000, canvas.height / 2], [canvas.width + 2000, canvas.height / 2], [canvas.width + 2000, canvas.height + 800], [-1000, canvas.height + 800]]

        //Calcolo solamente il pitch: le prime due coordinate del cielo sono sempre uguali
        //Successivamente applicherò il roll!

        let roll = FlightData.planeRoll
        let pitch = FlightData.planePitch
        let heading = FlightData.planeHeading

        if(roll === undefined || pitch === undefined || heading === undefined){
            roll = 0
            pitch = 0;
            heading = 0;
        }

        let baseValue = 5.55555;
        baseSkyCoords[2][1] += pitch * baseValue;
        baseSkyCoords[3][1] += pitch * baseValue;
        baseGroundCoords[0][1] += pitch * baseValue;
        baseGroundCoords[1][1] += pitch * baseValue;

        if(this.#oldHeading === null){this.#oldHeading = heading}
        if(this.#oldHeading !== null && this.#oldHeading - heading > 150 || this.#oldHeading - heading < -150){
            //Devo ruotare tutto!
            this.#testaInGiu = !this.#testaInGiu;
            this.#oldHeading = heading
        }

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

        this.draw(canvas, baseSkyCoords, baseGroundCoords);

    }

    static getRotation(ctx) {
        const mat = ctx.getTransform();
        const rad = Math.atan2(mat.b, mat.a);
        if (rad < 0) { // angle is > Math.PI
            return rad + Math.PI * 2;
        }
        return rad;
    }

    static getRadianAngle(degreeValue) {
        return degreeValue * Math.PI / 180;
    }

    static draw(canvas, skyCoords, groundCoords){

        let ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        //SKY
        ctx.beginPath()
        ctx.moveTo(skyCoords[0][0], skyCoords[0][1]);
        for (let i = 0; i < skyCoords.length; i++) {
            ctx.lineTo(skyCoords[i][0], skyCoords[i][1]);
        }
        ctx.fillStyle = "lightblue"
        ctx.fill()

        //GROUND
        ctx.beginPath()
        ctx.moveTo(groundCoords[0][0], groundCoords[0][1]);
        for (let i = 0; i < groundCoords.length; i++) {
            ctx.lineTo(groundCoords[i][0], groundCoords[i][1]);
        }
        ctx.fillStyle = "saddlebrown"
        ctx.fill()

        canvas = document.getElementById('horizonBarCanvas')
        ctx = canvas.getContext('2d');

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

        ctx.stroke();
    }
}

exports.CanvasArtificialOrizon = CanvasArtificialOrizon;
