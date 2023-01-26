class CanvasCompassRender {
    constructor(props) {
    }

    static render(){

        let c = document.getElementById('myCanvas')
        let ctx = c.getContext('2d');
        let textcTX = c.getContext('2d')
        //Linea principale
        ctx.beginPath();
        ctx.strokeStyle = 'white';

        ctx.clearRect(0, 0, c.width, c.height);

        //Creo le posizioni dei vari numeri
        let deg = FlightData.planeHeading;
        if(deg === undefined) deg = Settings.getData('startingHeading');
        deg = deg - 25;
        for(let i = 1; i < 100; i++) {


            if(i === 51){
                ctx.stroke();
                this.drawCentralIndicator(ctx,deg,i);
                deg+=0.5
                continue;
            }


            if(deg < 0){deg+=360}
            if(deg > 360){deg=deg%360}

            ctx.moveTo(105+(i*10),95)

            let height = 0;

            if(deg%90 === 0){
                let letter = "N";

                if(deg%90 === 0) letter="E";
                if(deg%180 === 0) letter="S";
                if(deg%270 === 0) letter="W";
                if(deg%360 === 0) letter="N";
                ctx.font = "bold 30px serif";
                ctx.fillStyle = "red";
                ctx.fillText(letter, 105+(i*10)-10, 30);
                height = 40
            }
            else if(deg%30 === 0){
                ctx.fillStyle = "white";
                ctx.font = "bold 22px serif";

                let offset = 10
                if(deg > 100) offset = 15

                ctx.fillText(deg, 105+(i*10)-offset, 30);
                height = 40
            }
            else if (deg%10 === 0){
                ctx.fillStyle = "lightgray";
                ctx.font = "bold 22px serif";

                let offset = 10
                if(deg > 100) offset = 15

                ctx.fillText(deg, 105+(i*10)-offset, 40);
                height = 50
            }
            else if (deg%10 !== 0) {
                height = 80

            }
            ctx.lineTo(105+(i*10),height)
            deg += 0.5
        }

        ctx.stroke();
    }

    static drawCentralIndicator(ctx,deg,i){
        //ctx.moveTo(585,50)

        //ctx.lineTo(585,10)
        //ctx.lineTo(645,10)
        //ctx.lineTo(645,50)
        //ctx.lineTo(585,50)



        this.roundRect(585, 10, 60, 40, 10,ctx);

        ctx.moveTo(615,50)
        ctx.lineTo(615,95)

        ctx.strokeStyle="white";
        ctx.lineWidth="1";

        if(deg%90 === 0){
            let letter = "N";
            if(deg%90 === 0) letter="E";
            if(deg%180 === 0) letter="S";
            if(deg%270 === 0) letter="W";
            if(deg%360 === 0) letter="N";
            ctx.font = "bold 30px serif";
            ctx.fillStyle = "red";
            ctx.fillText(letter, 105+(i*10)-10, 40);

        }
        else {
            ctx.fillStyle = "white";
            ctx.font = "bold 22px serif";

            let offset = 10
            if(deg > 100) offset = 15

            ctx.fillText(deg, 105+(i*10)-offset, 37);
        }



    }

    static roundRect(x, y, w, h, radius,cont)
    {
        let r = x + w;
        let b = y + h;

        let c = document.getElementById('myCanvas')
        let context = c.getContext('2d');

        context.beginPath()
        context.strokeStyle="red";
        context.lineWidth="4";

        context.moveTo(x+radius, y);
        context.lineTo(r-radius, y);
        context.quadraticCurveTo(r, y, r, y+radius);
        context.lineTo(r, y+h-radius);
        context.quadraticCurveTo(r, b, r-radius, b);
        context.lineTo(x+radius, b);
        context.quadraticCurveTo(x, b, x, b-radius);
        context.lineTo(x, y+radius);
        context.quadraticCurveTo(x, y, x+radius, y);

        context.stroke()
    }
}

exports.CanvasCompassRender = CanvasCompassRender;
