const { app, BrowserWindow, globalShortcut } = require('electron');
const path = require('path');
const {ROOT_FOLDER} = require('../conf/edc_const');
const url = require('url');

function createWindow () {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        icon: ROOT_FOLDER + '/static/help/assets/images/favicon.ico',
    });

    const viewerUrl = url.pathToFileURL('/static/help/index.html').href.replace("C:/", "");
    
    // Allow you to open devtools
    globalShortcut.register('CommandOrControl+I', () => { win.webContents.openDevTools(); });
    
    win.loadURL(viewerUrl);

    // Redirect to first webpage again
    win.webContents.on('did-fail-load', () => {
        console.log('did-fail-load');
        win.loadURL(viewerUrl);
    });

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
