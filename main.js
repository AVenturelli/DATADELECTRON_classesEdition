const {app, BrowserWindow, ipcMain} = require('electron')
const path = require("path");
const application = require('express')()
// Keep a global reference of the window object. If you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.


app.on('ready', function () {

    // Create the browser window
    let mainWindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
        nodeIntegrationInWorker: true,
        frame: false,
        icon: path.resolve(__dirname, './datad_icon.ico'),
        width: 1902,
        height: 1080
    });

    mainWindow.maximize()

    // and load the index.html of the app.
    mainWindow.loadURL('file://' + __dirname + '/index.html');

    // Returned when the window is closed.
    mainWindow.on('closed', function () {
        // Dereference the window object. Usually you would store windows
        // in an array if your app supports multi windows. This is the time
        // when you should delete the corresponding element.
        mainWindow = null;
    });

    // On a PC, the app will quit when we close all windows.
    // On a Mac, applications must be explicitly closed.
    app.on('window-all-closed', function () {
        if (process.platform !== 'darwin') {
            app.quit();
        }
    });

    mainWindow.webContents.reloadIgnoringCache()
});