const { app, BrowserWindow, globalShortcut } = require('electron');
const path = require('path');
const rootPath = require('electron-root-path').rootPath;
const log = require('electron-log');
const config = require("../conf/config_electron_viewer.json");
const {getLogTransportConsole, getLogTransportFile, getLogResolvePath} = require('./lib/logFormat');
const menuTemplate = require('./menu.js');
const fetch = require('electron-main-fetch');

function createWindow () {

    // Method to format the writing of logs and configure path file
    getLogTransportConsole();
    getLogTransportFile();
    getLogResolvePath();

    // Create main window
    let mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        icon: getAppIcon(),
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        }
    });

    let viewerUrl = `./public/index.html`;

    mainWindow.loadFile(viewerUrl);

    const loadURLInterval = setInterval(loadUrlFromServer, 5000);

    function stopInterval(){
        clearInterval(loadURLInterval);
    }

    function loadUrlFromServer(){
        (async () => {
            await fetch(`${config.protocol+config.hostname}:${config.server_port}/viewerurl`, {method: "GET"})
            .then(response => response.json())
            .then(data => {
                if(data.url !== undefined){
                    mainWindow.reload();
                    mainWindow.loadURL(data.url);
                    stopInterval();
                }
            })
            .catch((e)=>{
                console.log(e);
            });
        })();
    }
    
    // Allow you to open devtools
    globalShortcut.register('CommandOrControl+I', () => { mainWindow.webContents.openDevTools(); });
   
    globalShortcut.register('f5', function() {
		mainWindow.reload();
        mainWindow.loadURL(viewerUrl);
	})
    globalShortcut.register('CommandOrControl+R', function() {
		mainWindow.reload();
        mainWindow.loadURL(viewerUrl);
	})
}

function getAppIcon() {
	switch (process.platform) {
		case 'win32':
			return path.join(rootPath, 'static', 'assets', 'building', 'win32', 'favicon.ico');
		case 'linux':
			return path.join(rootPath, 'static', 'assets', 'building', 'linux', 'favicon.png');
		case 'darwin':
			return path.join(rootPath, 'static', 'assets', 'building', 'darwin', 'favicon.png');
	}
}

app.whenReady().then(() => {
    // When the app is ready, that run the app
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

// Managing the closing of all windows
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});
