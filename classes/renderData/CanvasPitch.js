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
        if(deg === undefined){deg=0}

        ctx.clearRect(0, 0, c.width, c.height);

        this.drawCentralIndicator(ctx);

        let originalDeg = Math.round(deg)
        //TODO ATTENZIONE! PROBABILMENTE DEVO CAMBIARE SEGNO!


        //console.log(originalDeg)
        if(originalDeg > 90 ){originalDeg = 90}
        if(originalDeg < -90){originalDeg = -90}
        deg = originalDeg - 20

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

                let offset = 10;

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
            if(deg%5 !== 0){height = 40;center=80}
            if(deg%5 === 0){height = 70; center = 65}
            if(deg%10 === 0){height = 120; center = 40}

            ctx.moveTo(center, 20 + currentHeightUtity)
            ctx.lineTo(height+center, 20 + currentHeightUtity)
            deg += 0.5
        }

        ctx.stroke();
    }

    static drawCentralIndicator(ctx, deg, i) {

        //this.roundRect(30, 180, 60, 40, 10, ctx);

        ctx.strokeStyle = "lightcoral";
        ctx.lineWidth = "4";

        ctx.moveTo(0, 340)
        ctx.lineTo(200, 340)
        ctx.moveTo(100, 240)
        ctx.lineTo(100, 440)

        ctx.stroke()
        ctx.beginPath()
        ctx.strokeStyle = "black";
        ctx.lineWidth = "2";
    }
}

exports.CanvasPitch = CanvasPitch;
