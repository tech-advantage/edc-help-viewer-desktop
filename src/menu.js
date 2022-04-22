const { Menu } = require('electron');
const config = require('../conf/config_electron_viewer.json');
const isMac = process.platform === 'darwin';
const isEnabledMenu = config.isEnableMenu;

const template = [
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
            ...(isMac ? [
              { role: 'pasteAndMatchStyle' },
              { role: 'selectAll' },
              { type: 'separator' },
            ] : [
              { type: 'separator' },
              { role: 'selectAll' }
            ])
        ],
    },
    {
        label: 'View',
        submenu: [
          { type: 'separator' },
          { role: 'resetZoom' },
          { role: 'zoomIn' },
          { role: 'zoomOut' },
          { type: 'separator' },
          { role: 'togglefullscreen' }
        ],
    },
    {
        label: 'Window',
        submenu: [
          { role: 'minimize' },
          ...(isMac ? [
            { type: 'separator' },
            { role: 'front' },
            { type: 'separator' },
            { role: 'window' }
          ] : [])
        ]
    },
];

const menu = Menu.buildFromTemplate(template);
Menu.setApplicationMenu(isEnabledMenu ? menu : null);