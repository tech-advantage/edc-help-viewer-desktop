import { PathResolver } from './utils/path-resolver';
import { BrowserWindow, Menu } from 'electron';
import * as configViewer from '../conf/config_electron_viewer.json';

const isMac = process.platform === 'darwin';
const isEnabledMenu = configViewer.browserWindow.isEnableMenu;

const template: any = [
  {
    label: 'File',
    submenu: [isMac ? { role: 'close' } : { role: 'quit' }],
  },
  {
    label: 'Edit',
    submenu: [
      { role: 'cut' },
      { role: 'copy' },
      { role: 'paste' },
      ...(isMac
        ? [{ role: 'pasteAndMatchStyle' }, { role: 'selectAll' }, { type: 'separator' }]
        : [{ type: 'separator' }, { role: 'selectAll' }]),
    ],
  },
  {
    label: 'View',
    submenu: [
      {
        label: 'Back to Home page',
        click(menuItem: Menu, browserWindow: BrowserWindow) {
          browserWindow.loadURL(PathResolver.getHelpViewerHomePath());
        },
      },
      {
        label: 'Previous page',
        click(menuItem: Menu, browserWindow: BrowserWindow) {
          browserWindow.webContents.goBack();
        },
      },
      { type: 'separator' },
      { role: 'resetZoom' },
      { role: 'zoomIn' },
      { role: 'zoomOut' },
      { type: 'separator' },
      { role: 'togglefullscreen' },
    ],
  },
  {
    label: 'Window',
    submenu: [
      { role: 'minimize' },
      ...(isMac ? [{ type: 'separator' }, { role: 'front' }, { type: 'separator' }, { role: 'window' }] : []),
    ],
  },
];

const menu = Menu.buildFromTemplate(template);
Menu.setApplicationMenu(isEnabledMenu ? menu : null);
