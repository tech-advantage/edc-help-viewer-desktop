const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')
const rootPath = require('electron-root-path').rootPath
const log = require('electron-log')
require('./src/menu.js')
const { getLogTransportConsole, getLogTransportFile, getLogResolvePath } = require('./src/lib/logFormat')
const ConstructURL = require('./src/utils/ConstructURL')

function createWindow () {
  // Method to format the writings logs
  getLogTransportConsole()
  getLogTransportFile()
  getLogResolvePath()

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
    show: false
  })

  mainWindow.loadURL(`${ConstructURL.getStaticFileLoaderPath()}`)
    .then(() => {
      log.info('index.html was loaded successfully')
      mainWindow.loadURL(`${ConstructURL.getHelpViewerHomePath()}`)

        .then(() => {
          log.info('Home page viewer was loaded successfully')
        })
        .catch(err => log.error(err))
    })
    .catch(err => log.error(err))

  // Receive request from server
  ipcMain.on('requested-url', (e, url) => {
    mainWindow.loadURL(url)
    mainWindow.show()
    mainWindow.maximize()
    // If unknown URL, redirect to viewer homepage
    mainWindow.webContents.on('did-fail-load', function () {
      log.error('Failed to load URL: ' + url)
      mainWindow.loadURL(`${ConstructURL.getHelpViewerHomePath()}`)
        .then(() => {
          log.info('Home page viewer was loaded successfully')
        })
        .catch(err => log.error(err))
    })
  })
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
