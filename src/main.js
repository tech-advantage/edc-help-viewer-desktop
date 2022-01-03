const { app, BrowserWindow, globalShortcut } = require('electron');
const path = require('path');
const rootPath = require('electron-root-path').rootPath;
const log = require('electron-log');
const {getLogTransportConsole, getLogTransportFile, getLogResolvePath} = require('./lib/logFormat')
const menuTemplate = require('./menu.js')

function createWindow () {

    // Method to format the writing of logs and configure path file
    getLogTransportConsole()
    getLogTransportFile()
    getLogResolvePath()

    // Create main window
    let mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        icon: getAppIcon()
    });

    // Allow you to open devtools
    globalShortcut.register('CommandOrControl+I', () => { mainWindow.webContents.openDevTools(); });
    
    let viewerUrl = `file://${rootPath}/static/help/index.html`;

    mainWindow.loadURL(viewerUrl).then(() => {log.info("index.html was loading succesfully")}).catch((error) => {log.error(error)});
    
    globalShortcut.register('f5', function() {
		mainWindow.reload()
        mainWindow.loadURL(viewerUrl);
	})
    globalShortcut.register('CommandOrControl+R', function() {
		mainWindow.reload()
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
