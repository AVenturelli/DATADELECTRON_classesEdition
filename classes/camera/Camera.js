const {io} = require("socket.io-client");
const VideoConnection = require("./VideoConnection").VideoConnection;
const DatadCesium = require("../DatadCesium").DatadCesium;

class Camera {
    constructor() {
    }

    static #streamingStatus = true;
    static socketA;
    static divSocket;

    static videoConnection;

    static createListener(){
        $('#startStreaming').on('click',() => {

            DatadCesium.changeRenderLoopState(false);

            $('#showCamera').css('border-color', 'lightcoral');
            $('#showCamera').css('cursor', 'not-allowed');

            $('#showCesium').css('border-color', 'lightgray');
            $('#showCesium').css('cursor', 'pointer');
            $('#showArtificialHorizon').css('border-color', 'lightgray');
            $('#showArtificialHorizon').css('cursor', 'pointer');

            $('#planeCamera').show();
            $('#firstPerson').hide('fast');
            $('#thirdPerson').hide('fast');
            $( "#cesiumContainer" ).slideUp();

            $('#planeCamera').css('z-index',9999)
            $('#cesiumContainer').css('z-index',9998)

            let linkStream = $('#streamLink').val()
            let streamWidth = $('#streamWidth').val()
            let streamHeight = $('#streamHeight').val()
            let streamQuality = $('#streamQuality').val()

            $('#cameraLinkModal').hide()



            this.startPlaying(linkStream,streamWidth,streamHeight,streamQuality).then(r => console.log("Avvio streaming"));

        })

        $('#showCesium').on('click',() => {

            DatadCesium.changeRenderLoopState(true);

            $('#showCesium').css('border-color', 'lightcoral');
            $('#showCesium').css('cursor', 'not-allowed');

            $('#showCamera').css('border-color', 'lightgray');
            $('#showCamera').css('cursor', 'pointer');
            $('#showArtificialHorizon').css('border-color', 'lightgray');
            $('#showArtificialHorizon').css('cursor', 'pointer');


            $('#cesiumContainer').show();
            $( "#planeCamera" ).slideUp();
            $('#firstPerson').show('fast');
            $('#thirdPerson').show('fast');

            $('#planeCamera').css('z-index',9998)
            $('#cesiumContainer').css('z-index',9999)
            
            $('#loadingCamera').show('fast')

            //Faccio vedere il canvas
            $('#canvasVideo').hide('fast')

            $('#horizonCanvas').hide();
            $('#cameraLinkModal').hide()

            this.stopSocket();
        })

        $('#showArtificialHorizon').on('click',() => {

            DatadCesium.changeRenderLoopState(false);

            $('#showArtificialHorizon').css('border-color', 'lightcoral');
            $('#showArtificialHorizon').css('cursor', 'not-allowed');

            $('#showCamera').css('border-color', 'lightgray');
            $('#showCamera').css('cursor', 'pointer');
            $('#showCesium').css('border-color', 'lightgray');
            $('#showCesium').css('cursor', 'pointer');

            $('#cesiumContainer').hide();
            $( "#planeCamera" ).slideUp();
            $('#firstPerson').hide('fast');
            $('#thirdPerson').hide('fast');
            $('#cameraLinkModal').hide()

            $('#planeCamera').css('z-index',9998)
            $('#cesiumContainer').css('z-index',9999)

            $('#loadingCamera').show('fast')
            $('#canvasVideo').hide('fast')

            $('#horizonCanvas').show();

            this.stopSocket();
        })
    }

    static async startPlaying(linkStream, streamWidth, streamHeight,streamQuality) {

        this.videoConnection = new VideoConnection();
        this.videoConnection.initialize(linkStream,streamWidth,streamHeight,streamQuality).then(r => {
            this.doRender(streamWidth,streamHeight)
        });

    }

    static doRender(streamWidth,streamHeight){

        let canvas = document.getElementById("canvasVideo");
        let ctx = canvas.getContext("2d");
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        this.socketA = io('http://localhost:6147');

        this.socketA.on('start', (cou) => {

            let canvas = document.getElementById('canvasVideo')//'canvas')[0], select = container.getElementsByTagName('select')[0];

            this.divSocket = io('http://localhost:6147/cam');

            this.divSocket.on('data', function (data) {

                let bytes = new Uint8Array(data);

                let blob = new Blob([bytes], {type: 'application/octet-binary'});

                let url = URL.createObjectURL(blob);

                let img = new Image;

                let ctx = canvas.getContext("2d");

                //Rimuovo il loader
                $('#loadingCamera').hide('fast')
                ///////

                //Faccio vedere il canvas
                $('#canvasVideo').show('fast')

                let xStart =  1230/2-streamWidth/2
                let yStart =  1000/2-streamHeight/2

                console.log(xStart+" e "+yStart)

                img.onload = function () {
                    URL.revokeObjectURL(url);
                    ctx.drawImage(img, xStart, yStart);
                };
                img.src = url;
            });
        });
    }

    static stopSocket(){

        if(this.socketA !== undefined){
            this.socketA.disconnect();
        }
        if(this.divSocket !== undefined){
            this.divSocket.disconnect();
        }
        if(this.videoConnection !== undefined){
            this.videoConnection.kill()
        }
    }
}

exports.Camera = Camera;
