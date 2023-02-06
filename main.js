const {app,BrowserWindow,ipcMain } = require('electron')
const path = require("path");
const application = require('express')()
// Keep a global reference of the window object. If you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.


app.on('ready', function() {


         /*server = require('http').Server(application)
         io = require('socket.io')(server, {
             cors: {
                 origin: '*',
             }
         });
         rtsp = require('rtsp-ffmpeg')

// use rtsp = require('rtsp-ffmpeg') instead if you have install the package
    server.listen(6148, function(){
        console.log('Listening on localhost:6147');
    });


    var cams = [
        'rtsp://wowzaec2demo.streamlock.net/vod/mp4:BigBuckBunny_115k.mp4'
        , 'rtsp://freja.hiof.no:1935/rtplive/definst/hessdalen03.stream'
        , 'udp://localhost:1234'
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

    /*application.get('/', function (req, res) {
        res.sendFile(__dirname + '/componenti_html/test.html');
    });*/



    // Create the browser window
    let mainWindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
        nodeIntegrationInWorker: true,
        frame: false,
        icon: path.resolve(__dirname,'./datad_icon.ico'),
        width: 1902,
        height: 1080
    });

    mainWindow.maximize()

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
        if (process.platform !== 'darwin') {
            app.quit();
        }
    });

    mainWindow.webContents.reloadIgnoringCache()
});