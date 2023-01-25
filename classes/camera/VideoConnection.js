const rtsp = require("rtsp-ffmpeg");
const application = require('express')()
class VideoConnection {

    server = null;
    constructor(props) {
    }

    async initialize(linkStream,streamWidth,streamHeight,streamQuality){

        this.server = require('http').Server(application)
        let io = require('socket.io')(this.server, {
            cors: {
                origin: '*',
            }
        });

        this.server.listen(6147, function(){
            console.log('Listening on localhost:6147');
        });

        let stream = new rtsp.FFMpeg({input: linkStream, resolution: streamWidth+"x"+streamHeight, quality: streamQuality});

        stream.on('start', function() {
            console.log('stream started');
        });

        stream.on('stop', function() {
            console.log('stream stopped');
        });

        let ns = io.of('/cam');

        ns.on('connection', function(wsocket) {

            let pipeStream = function(data) {
                wsocket.emit('data', data);
            };

            stream.on('data', pipeStream);

            wsocket.on('disconnect', function() {
                console.log('disconnected from /cam');
                stream.removeListener('data', pipeStream);
            });
        });

        io.on('connection', function(socket) {
            socket.emit('start', 1);
        });
    }

    kill(){
        if(this.server !== null){
            this.server.close();
        }
    }
}

exports.VideoConnection = VideoConnection;
