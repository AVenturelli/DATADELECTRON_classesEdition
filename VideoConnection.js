const rtsp = require("rtsp-ffmpeg");
const application = require('express')()
class VideoConnection {
    constructor(props) {

        let server = require('http').Server(application)
        let io = require('socket.io')(server, {
            cors: {
                origin: '*',
            }
        });

        server.listen(6147, function(){
            console.log('Listening on localhost:6147');
        });


        let cams = 'rtsp://demo:demo@ipvmdemo.dyndns.org:5541/onvif-media/media.amp?profile=profile_1_h264&sessiontimeout=60&streamtype=unicast';

        let stream = new rtsp.FFMpeg({input: cams, resolution: '600x450', quality: 3});

        stream.on('start', function() {
            console.log('stream started');
        });

        stream.on('stop', function() {
            console.log('stream stopped');
        });

        let ns = io.of('/cam');

        ns.on('connection', function(wsocket) {

            console.log('connected to /cam');
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

        application.get('/', function (req, res) {
            res.sendFile(__dirname + '/componenti_html/videoCanvas.html');
        });
    }
}

exports.VideoConnection = VideoConnection;
