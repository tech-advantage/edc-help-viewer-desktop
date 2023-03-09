import { app, BrowserWindow, ipcMain } from 'electron';
import './menu';
import { Logger } from './lib/logger';
import { ConfigElectronViewer } from './utils/config-electron-viewer';
import { PathResolver } from './utils/path-resolver';
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_WEBPACK_ENTRY: string;

const createWindow = (): void => {
  // Create main window
  const mainWindow = new BrowserWindow({
    width: ConfigElectronViewer.getBrowserWindowWidthConfig(),
    height: ConfigElectronViewer.getBrowserWindowHeightConfig(),
    icon: PathResolver.getAppIcon(),
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: true,
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
    },
    show: false,
  });
  mainWindow.webContents.reloadIgnoringCache();
  handleHeaders(mainWindow);

  mainWindow
    .loadURL(MAIN_WINDOW_WEBPACK_ENTRY)
    .then(() => {
      mainWindow.webContents.openDevTools();
      Logger.log().info('index.html was loaded successfully');
      mainWindow
        .loadURL(`${PathResolver.getHelpViewerHomePath()}`)
        .then(() => {
          Logger.log().info('Home page viewer was loaded successfully');
        })
        .catch((err) => Logger.log().error(err));
    })
    .catch((err) => Logger.log().error(err));

  redirectFromPostRequest(mainWindow);
};

const handleHeaders = (win: any) => {
  win.webContents.session.webRequest.onBeforeSendHeaders((details: any, callback: any) => {
    callback({ requestHeaders: { Origin: '*', ...details.requestHeaders } });
  });
  win.webContents.session.webRequest.onHeadersReceived((details: any, callback: any) => {
    callback({
      responseHeaders: {
        'Access-Control-Allow-Origin': [
          ConfigElectronViewer.getHostName() + ':' + ConfigElectronViewer.getServerPortConfig(),
        ],
        // We use this to bypass headers
        'Access-Control-Allow-Headers': [
          ConfigElectronViewer.getHostName() + ':' + ConfigElectronViewer.getServerPortConfig(),
        ],
        ...details.responseHeaders,
      },
    });
  });
};

const redirectFromPostRequest = (win: BrowserWindow) => {
  // Receive request from server
  ipcMain.on('requested-url', (e, url) => {
    win.loadURL(url);
    win.show();

    // If unknown URL, redirect to viewer homepage
    win.webContents.on('did-fail-load', function () {
      Logger.log().error('Failed to load URL: ' + url);
      win
        .loadURL(`${PathResolver.getHelpViewerHomePath()}`)
        .then(() => {
          Logger.log().info('Home page viewer was loaded successfully');
        })
        .catch((err) => Logger.log().error(err));
    });
  });
};

app.whenReady().then(() => {
  if (require('electron-squirrel-startup')) app.quit();
  // When the app is ready, run the mainWindow
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Managing the closing of all windows
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
