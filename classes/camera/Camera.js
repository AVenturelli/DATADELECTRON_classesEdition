const DatadCesium = require("../DatadCesium").DatadCesium;

class Camera {

    static #streamingStatus = true;
    static socketA;
    static divSocket;

    static createListener(){
        $('#showCamera').on('click',() =>{

            DatadCesium.changeRenderLoopState(false);

            $('#showCamera').css('border-color', 'lightcoral');
            $('#showCamera').css('cursor', 'not-allowed');

            $('#showCesium').css('border-color', 'lightgray');
            $('#showCesium').css('cursor', 'pointer');

            $( "#cesiumContainer" ).slideUp(function() {
                $('#planeCamera').slideDown();
            });

            this.startPlaying();

        })

        $('#showCesium').on('click',() =>{
            DatadCesium.changeRenderLoopState(true);

            $('#showCesium').css('border-color', 'lightcoral');
            $('#showCesium').css('cursor', 'not-allowed');

            $('#showCamera').css('border-color', 'lightgray');
            $('#showCamera').css('cursor', 'pointer');

            $( "#planeCamera" ).slideUp(function() {
                $('#cesiumContainer').slideDown();
            });

            this.stopSocket();
        })
    }

    static startPlaying(){

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
