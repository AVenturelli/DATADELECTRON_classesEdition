class CanvasPitch {
    constructor() {
    }

    static render(){

        let c = document.getElementById('pitchCanvas')
        let ctx = c.getContext('2d');
        let textcTX = c.getContext('2d')
        //Linea principale
        ctx.beginPath();
        ctx.strokeStyle = 'black';

        let deg = FlightData.planePitch
        let roll = FlightData.planeRoll
        if(deg === undefined){deg=0}
        ctx.clearRect(0, 0, c.width, c.height);

        this.drawCentralIndicator(ctx);

        let originalDeg = -1*Math.round(deg)
        //TODO ATTENZIONE! PROBABILMENTE DEVO CAMBIARE SEGNO!


        //console.log(originalDeg)
        if(originalDeg > 90 ){originalDeg = 90}
        if(originalDeg < -90){originalDeg = -90}
        deg = originalDeg - 20

        ctx.translate(ctx.canvas.width * 0.5, ctx.canvas.height * 0.5);    // center
        let oldRotation = this.getRotation(ctx)
        ctx.rotate(-oldRotation);
        ctx.rotate(this.getRadianAngle(roll));                                         // 90°
        ctx.translate(-ctx.canvas.width * 0.5, -ctx.canvas.height * 0.5);

        for (let i = 0; i < 80; i++) {

            let currentHeightUtity = i*8

            if(deg > 90 || deg < -90){
                deg+=0.5
                continue
            }

            if (deg % 2.5 !== 0 && deg !== 0) {
                deg += 0.5
                continue
            }

            let height = 0;

            if (deg % 10 === 0 || deg === 0) {
                if (deg % 100 === 0 || deg === 0) {
                    ctx.fillStyle = "red";
                    ctx.font = "bold 22px serif";
                } else {
                    ctx.fillStyle = "black";
                    ctx.font = "bold 22px serif";
                }

                let offset = 250;

                if(deg !== 0) {
                    ctx.fillText(Math.abs(deg), offset, 25 + currentHeightUtity);
                    ctx.fillText(Math.abs(deg), offset+160, 25 + currentHeightUtity);
                }
                else {
                    ctx.fillText(Math.abs(deg), offset, 25 + currentHeightUtity);
                    ctx.fillText(Math.abs(deg), offset+160, 25 + currentHeightUtity);
                }
            }
            let center = 0;
            if(deg%5 !== 0){height = 40;center=80+240}
            if(deg%5 === 0){height = 70; center = 65+240}
            if(deg%10 === 0){height = 120; center = 40+240}

            ctx.moveTo(center, 20 + currentHeightUtity)
            ctx.lineTo(height+center, 20 + currentHeightUtity)
            deg += 0.5
        }

        ctx.stroke();
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

    static drawCentralIndicator(ctx, deg, i) {

        //this.roundRect(30, 180, 60, 40, 10, ctx);

        ctx.strokeStyle = "lightcoral";
        ctx.lineWidth = "4";

        ctx.moveTo(240, 340)
        ctx.lineTo(440, 340)
        ctx.moveTo(340, 240)
        ctx.lineTo(340, 440)

        ctx.stroke()
        ctx.beginPath()
        ctx.strokeStyle = "black";
        ctx.lineWidth = "2";
    }
}

exports.CanvasPitch = CanvasPitch;
