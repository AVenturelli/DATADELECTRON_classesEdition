const {io} = require("socket.io-client");
const VideoConnection = require("./VideoConnection").VideoConnection;
const DatadCesium = require("../DatadCesium").DatadCesium;

class Camera {

    static #streamingStatus = true;
    static socketA;
    static divSocket;
    static showCamera = $('#showCamera');
    static showCesium = $('#showCesium');


    static createListener(){
        $('#showCamera').on('click',() => {

            DatadCesium.changeRenderLoopState(false);

            this.showCamera.css('border-color', 'lightcoral');
            this.showCamera.css('cursor', 'not-allowed');

            this.showCesium.css('border-color', 'lightgray');
            this.showCesium.css('cursor', 'pointer');

            $( "#cesiumContainer" ).slideUp(function() {
                $('#planeCamera').slideDown();
                $('#firstPerson').hide('fast');
                $('#thirdPerson').hide('fast');
            });

            this.startPlaying().then(r => console.log("Avvio streaming"));

        })

        $('#showCesium').on('click',() => {

            DatadCesium.changeRenderLoopState(true);

            this.showCesium.css('border-color', 'lightcoral');
            this.showCesium.css('cursor', 'not-allowed');

            this.showCamera.css('border-color', 'lightgray');
            this.showCamera.css('cursor', 'pointer');

            $( "#planeCamera" ).slideUp(function() {
                $('#cesiumContainer').slideDown();
                $('#firstPerson').show('fast');
                $('#thirdPerson').show('fast');
            });

            this.stopSocket();
        })
    }

    static async startPlaying() {

        let a = new VideoConnection();
        a.initialize().then(r => {
            this.doRender()
        });

    }

    static doRender(){

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

                img.onload = function () {
                    URL.revokeObjectURL(url);
                    ctx.drawImage(img, 0, 0);
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
    }
}

exports.Camera = Camera;
