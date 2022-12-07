const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')
const Logger = require('./src/lib/Logger.js')
const rootPath = require('electron-root-path').rootPath
require('./src/menu.js')

const PathResolver = require('./src/utils/PathResolver')

function createWindow () {
  // Create main window
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    icon: getAppIcon(),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, './preload.js')
    }, 
  })
  mainWindow.maximize()
  mainWindow.webContents.reloadIgnoringCache()
  mainWindow.webContents.openDevTools();
  mainWindow.maximize()
  mainWindow.loadURL(`${PathResolver.getStaticFileLoaderPath()}`)
  .then(() => {
    Logger.log().info('index.html was loaded successfully')
    mainWindow.loadURL(`${PathResolver.getHelpViewerHomePath()}`)
    
    .then(() => {
      Logger.log().info('Home page viewer was loaded successfully')
     
    })
    .catch(err => Logger.log().error(err))
  })
  .catch(err => Logger.log().error(err))
  
  // Receive request from server
  ipcMain.on('requested-url', (e, url) => {
    mainWindow.loadURL(url)
    mainWindow.show()
 
    mainWindow.focus()
    // If unknown URL, redirect to viewer homepage
    mainWindow.webContents.on('did-fail-load', function () {
      Logger.log().error('Failed to load URL: ' + url)
      mainWindow.loadURL(`${PathResolver.getHelpViewerHomePath()}`)
        .then(() => {
          Logger.log().info('Home page viewer was loaded successfully')
        })
        .catch(err => Logger.log().error(err))
    })
  })

 

  mainWindow.webContents.on('new-window', function(e, url) {
    e.preventDefault();
    require('electron').shell.openExternal(url);
  });
}



function getAppIcon () {
  switch (process.platform) {
    case 'win32':
      return path.join(rootPath, 'static', 'assets', 'building', 'win32', 'favicon.ico')
    case 'linux':
      return path.join(rootPath, 'static', 'assets', 'building', 'linux', 'favicon.png')
    case 'darwin':
      return path.join(rootPath, 'static', 'assets', 'building', 'darwin', 'favicon.png')
  }
}


app.whenReady().then(() => {
  // When the app is ready, run the mainWindow
  createWindow()
  
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Managing the closing of all windows
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
