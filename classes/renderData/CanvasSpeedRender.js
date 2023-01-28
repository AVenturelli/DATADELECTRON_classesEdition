class CanvasSpeedRender {
    constructor() {
    }

    static render(){
        let c = document.getElementById('speedCanvas')
        let ctx = c.getContext('2d');
        let textcTX = c.getContext('2d')
        //Linea principale
        ctx.beginPath();
        ctx.strokeStyle = 'white';

        ctx.clearRect(0, 0, c.width, c.height);

        //Creo le posizioni dei vari numeri

        let originalDeg = FlightData.airSpeed;
        let deg = 0;
        if(isNaN(originalDeg) || originalDeg === undefined){
            deg = 0;
            originalDeg = 0;
        }
        else{
            deg = originalDeg;
        }

        deg -= 15;

        this.drawCentralIndicator(ctx, originalDeg);

        for (let i = 0; i < 60; i++) {

            if(deg < 0) {
                deg+=0.5
                continue;
            }

            if((deg%1!==0 || deg%2!==0) && deg !== 0){
                deg+=0.5
                continue
            }

            ctx.moveTo(5,20+(i/2 * 12))

            let height = 0;

            if (deg % 10 === 0 || deg === 0) {
                if(deg%100 === 0 || deg === 0) {
                    ctx.fillStyle = "red";
                    ctx.font = "bold 22px serif";
                }else {
                    ctx.fillStyle = "white";
                    ctx.font = "bold 22px serif";
                }

                let offset = 27;

                if(deg<100) offset = 47;

                if(deg<10) offset = 55;

                if(deg>=100) offset = 43;

                if(i===28 || i === 29 || i === 30 || i === 31 || i ===32){
                    //Dont draw
                }else
                {
                    ctx.fillText(deg,offset, 25 + (i/2 * 12));
                    height = 35
                }
            }
            else{
                height = 15
            }
            ctx.lineTo(height,20+(i/2 * 12))
            deg += 0.5
        }

        ctx.stroke();
    }

    static drawCentralIndicator(ctx,deg,i){

        this.roundRect(30,180, 60, 40, 10,ctx);

        ctx.strokeStyle="red";
        ctx.lineWidth="2";

        ctx.moveTo(30,200)
        ctx.lineTo(5,200)

        ctx.stroke()

        ctx.beginPath()

        ctx.strokeStyle="white";
        ctx.lineWidth="1";
        ctx.fillStyle = "black";
        ctx.font = "bold 22px serif";


        let offset = 27;

        if(deg<100) offset = 47;

        if(deg<10) offset = 55;

        if(deg>=100) offset = 43;

        ctx.fillText(deg, offset,207);

    }

    static roundRect(x, y, w, h, radius,cont)
    {
        let r = x + w;
        let b = y + h;

        let c = document.getElementById('speedCanvas')
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

exports.CanvasSpeedRender = CanvasSpeedRender;
