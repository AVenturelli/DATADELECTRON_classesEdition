class CanvasAltitudeRender {
    constructor() {
    }

    static render(){
        let c = document.getElementById('altitudeCanvas')
        let ctx = c.getContext('2d');
        let textcTX = c.getContext('2d')
        //Linea principale
        ctx.beginPath();
        ctx.strokeStyle = 'white';

        ctx.clearRect(0, 0, c.width, c.height);

        //Creo le posizioni dei vari numeri
        //let deg = FlightData.planeHeading;
        // if (deg === undefined) deg = Settings.getData('startingHeading');
        let originalDeg = FlightData.airSpeed;
        let deg = 0;
        if(isNaN(originalDeg) || originalDeg === undefined){
            deg = 0;
            originalDeg = 0;
        }
        else{
            deg = Math.round(deg/10)
            deg = originalDeg;
        }

        deg -= 15;

        for (let i = 0; i < 60; i++) {

            if(deg < 0) {
                deg+=0.5
                continue;
            }

            if((deg%1!==0 || deg%2!==0) && deg !== 0){
                deg+=0.5
                continue
            }

            ctx.moveTo(95,20 + (i * 6))

            let height = 0;

            if (deg*10 % 100 === 0 || deg===0) {
                if(deg*10%1000 === 0 || deg === 0) {
                    ctx.fillStyle = "red";
                    ctx.font = "bold 22px serif";
                }else {
                    ctx.fillStyle = "white";
                    ctx.font = "bold 22px serif";
                }

                let offset = 27;

                if(deg*10<100) offset = 30;

                if(deg*10>=100) offset = 25;

                if(deg*10>=1000) offset = 20;

                if(i===28 || i === 29 || i === 30 || i === 31 || i === 32){
                    //Dont draw
                    height = 65
                }else {
                    ctx.fillText(deg*10,offset, 20 + (i * 6));
                    height = 65
                }
            }
            else{
                height = 85
            }
            ctx.lineTo(height,20 + (i * 6))
            deg += 0.5
        }

        ctx.stroke();

        this.drawCentralIndicator(ctx, Math.round(originalDeg/10));
    }

    static drawCentralIndicator(ctx,deg){


        this.roundRect(10,180, 60, 40, 10,ctx);

        ctx.strokeStyle="red";
        ctx.lineWidth="2";

        ctx.moveTo(70,200)
        ctx.lineTo(95,200)

        ctx.stroke()

        ctx.beginPath()

        ctx.strokeStyle="white";
        ctx.lineWidth="1";

        ctx.fillStyle = "black";
        ctx.font = "bold 22px serif";

        let offset = 27;

        if(deg*10<100) offset = 30;

        if(deg === 0) offset = 35;

        if(deg*10>=100) offset = 25;

        if(deg*10>=1000) offset = 20;

        console.log(offset)

        ctx.fillText(deg*10, offset,207);

    }

    static roundRect(x, y, w, h, radius,cont)
    {
        let r = x + w;
        let b = y + h;

        let c = document.getElementById('altitudeCanvas')
        let context = c.getContext('2d');

        context.beginPath()
        context.strokeStyle="red";
        context.lineWidth="2";

        context.moveTo(x+radius, y);
        context.lineTo(r-radius, y);
        context.quadraticCurveTo(r, y, r, y+radius);
        context.lineTo(r, y+h-radius);
        context.quadraticCurveTo(r, b, r-radius, b);
        context.lineTo(x+radius, b);
        context.quadraticCurveTo(x, b, x, b-radius);
        context.lineTo(x, y+radius);
        context.quadraticCurveTo(x, y, x+radius, y);
        context.fillStyle = "white"
        context.fill()
        context.stroke()
    }
}
exports.CanvasAltitudeRender = CanvasAltitudeRender;
