const DatadCesium = require("../DatadCesium").DatadCesium;

class Camera {

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
        })
    }

    static connectCamera(){

        const video = $('#live');
        const constraints = {
            audio: false,
            video: true
        };

        navigator.mediaDevices.getUserMedia(constraints)
            .then((stream) => {
                const videoTracks = stream.getVideoTracks();
                console.log('Got stream with constraints:', constraints);
                console.log(`Using video device: ${videoTracks[0].label}`);
                stream.onremovetrack = () => {
                    console.log('Stream ended');
                };
                video.srcObject = stream;
            })
            .catch((error) => {
                if (error.name === 'ConstraintNotSatisfiedError') {
                    console.error(
                        `The resolution ${constraints.video.width.exact}x${constraints.video.height.exact} px is not supported by your device.`
                    );
                } else if (error.name === 'PermissionDeniedError') {
                    console.error(
                        'Permissions have not been granted to use your camera and ' +
                        'microphone, you need to allow the page access to your devices in ' +
                        'order for the demo to work.'
                    );
                } else {
                    console.error(`getUserMedia error: ${error.name}`, error);
                }
            });
    }

    static startPlaying(){
        let socketA = io('http://localhost:6147');

        socketA.on('start', function(cou) {
            let container = document.getElementById('container');

            document.getElementById('add').onclick = () => {
                let divSocket;
                let div = document.createElement('div')
                let html = '<select><option value="/">select cam</option>';
                for (var i = 0; i < cou; i++) {
                    html += '<option value="/cam' + i + '">Cam ' + i + '</option>';
                }
                html += '</select>';
                html += "<canvas width='500' height='500'>";
                div.innerHTML = html;
                let canvas = div.getElementsByTagName('canvas')[0], select = div.getElementsByTagName('select')[0];

                select.onchange = function() {
                    if (divSocket) {
                        divSocket.disconnect();
                    }
                    console.log(location.origin + this.value);

                    divSocket = io('http://localhost:6147'+this.value);

                    //divSocket = io(location.origin + this.value);

                    divSocket.on('data', function(data) {

                        let bytes = new Uint8Array(data);

                        let blob = new Blob([bytes], {type: 'application/octet-binary'});

                        let url = URL.createObjectURL(blob);

                        let img = new Image;

                        let ctx = canvas.getContext("2d");

                        img.onload = function() {
                            URL.revokeObjectURL(url);
                            ctx.drawImage(img,100,100);

                        };

                        img.src = url;

                        //image.src = 'data:image/jpeg;base64,' + base64ArrayBuffer(bytes);
                    });
                };
                container.appendChild(div);
            };
        });
        function base64ArrayBuffer(arrayBuffer) {
            let base64    = '';
            let encodings = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
            let bytes         = new Uint8Array(arrayBuffer);
            let byteLength    = bytes.byteLength;
            let byteRemainder = byteLength % 3;
            let mainLength    = byteLength - byteRemainder;
            let a, b, c, d;
            let chunk;
            // Main loop deals with bytes in chunks of 3
            for (let i = 0; i < mainLength; i = i + 3) {
                // Combine the three bytes into a single integer
                chunk = (bytes[i] << 16) | (bytes[i + 1] << 8) | bytes[i + 2];
                // Use bitmasks to extract 6-bit segments from the triplet
                a = (chunk & 16515072) >> 18; // 16515072 = (2^6 - 1) << 18
                b = (chunk & 258048)   >> 12; // 258048   = (2^6 - 1) << 12
                c = (chunk & 4032)     >>  6; // 4032     = (2^6 - 1) << 6
                d = chunk & 63;               // 63       = 2^6 - 1
                // Convert the raw binary segments to the appropriate ASCII encoding
                base64 += encodings[a] + encodings[b] + encodings[c] + encodings[d];
            }
            // Deal with the remaining bytes and padding
            if (byteRemainder === 1) {
                chunk = bytes[mainLength];
                a = (chunk & 252) >> 2; // 252 = (2^6 - 1) << 2
                // Set the 4 least significant bits to zero
                b = (chunk & 3)   << 4; // 3   = 2^2 - 1
                base64 += encodings[a] + encodings[b] + '==';
            } else if (byteRemainder === 2) {
                chunk = (bytes[mainLength] << 8) | bytes[mainLength + 1];
                a = (chunk & 64512) >> 10; // 64512 = (2^6 - 1) << 10
                b = (chunk & 1008)  >>  4; // 1008  = (2^6 - 1) << 4
                // Set the 2 least significant bits to zero
                c = (chunk & 15)    <<  2; // 15    = 2^4 - 1
                base64 += encodings[a] + encodings[b] + encodings[c] + '=';
            }
            return base64;
        }
    }
}

exports.Camera = Camera;
