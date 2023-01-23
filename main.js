const {app,BrowserWindow,ipcMain } = require('electron')
const application = require('express')()
// Keep a global reference of the window object. If you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
var mainWindow = null;

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.

    let server = require('http').Server(application)
    let io = require('socket.io')(server, {
        cors: {
            origin: '*',
        }
    });
    let rtsp = require('rtsp-ffmpeg');

    server.listen(6147, function(){
        console.log('Listening on localhost:6147');
    });


    var cams = [
        'rtsp://demo:demo@ipvmdemo.dyndns.org:5541/onvif-media/media.amp?profile=profile_1_h264&sessiontimeout=60&streamtype=unicast'
    ].map(function(uri, i) {
        var stream = new rtsp.FFMpeg({input: uri, resolution: '320x240', quality: 3});
        stream.on('start', function() {
            console.log('stream ' + i + ' started');
        });
        stream.on('stop', function() {
            console.log('stream ' + i + ' stopped');
        });
        return stream;
    });

    cams.forEach(function(camStream, i) {
        var ns = io.of('/cam' + i);
        ns.on('connection', function(wsocket) {
            console.log('connected to /cam' + i);
            var pipeStream = function(data) {
                wsocket.emit('data', data);
            };
            camStream.on('data', pipeStream);

            wsocket.on('disconnect', function() {
                console.log('disconnected from /cam' + i);
                camStream.removeListener('data', pipeStream);
            });
        });
    });

    io.on('connection', function(socket) {
        socket.emit('start', cams.length);
    });

    application.get('/', function (req, res) {
        res.sendFile(__dirname + '/componenti_html/videoCanvas.html');
    });

app.on('ready', function() {

    // Create the browser window
    mainWindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
        nodeIntegrationInWorker: true,
        width: 1902, 
        height: 1080
    });

    // and load the index.html of the app.
    mainWindow.loadURL('file://' + __dirname + '/index.html');

    // Returned when the window is closed.
    mainWindow.on('closed', function() {
        // Dereference the window object. Usually you would store windows
        // in an array if your app supports multi windows. This is the time
        // when you should delete the corresponding element.
        mainWindow = null;
    });

    // On a PC, the app will quit when we close all windows.
    // On a Mac, applications must be explicitly closed.
    app.on('window-all-closed', function() {
        if (process.platform != 'darwin') {
            app.quit();
        }
    });

    mainWindow.webContents.reloadIgnoringCache()
});