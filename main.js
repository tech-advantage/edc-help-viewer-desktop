const { app, BrowserWindow } = require('electron');
const path = require('path');
const fs = require('fs');
const ROOT_FOLDER = path.resolve(__dirname)
function createWindow () {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, "/src/preload.js")
        }
    })

    win.loadFile('index.html');

    win.webContents.openDevTools();

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

fs.rmSync(ROOT_FOLDER + "\\" + 'edc-help-viewer.3.2.2', { recursive: true, force: true }, console.error);