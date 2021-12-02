const { app, BrowserWindow, globalShortcut } = require('electron');
const path = require('path');
const {ROOT_FOLDER} = require('../conf/edc_const')

function createWindow () {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, "/src/preload.js")
        }
    })
 
    const url = require('url').format({
        protocol: 'file',
        slashes: true,
        pathname: '/static/help/index.html'
    });
    globalShortcut.register('CommandOrControl+I', () => { win.webContents.openDevTools() })
    win.loadURL(url);

    // Redirect to first webpage again
    win.webContents.on('did-fail-load', () => {
        console.log('did-fail-load');
        win.loadURL(url);
    });
}

app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    })
})

// Managing the closing of all windows
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
})
