'use strict';



const {app, BrowserWindow, globalShortcut} = require('electron');
let win;

// メニュー

// const editMenu = [
//   {
//       label: 'Edit',
//       submenu: [
//           {
//             label: 'Comment ON',
//             // click: function() { comment = true; }
//           },
//           {
//             label: 'Comment OFF',
//             // click: function() { comment = false; }
//           },
//       ]
//   }
// ];

function createWindow () {

  win = new BrowserWindow({
    // "fullscreen": true,
    // "itleBarStyle": "hidden",
    "transparent": true,
    "alwaysOnTop": true,
    "nodeIntegration": false,
    "fullscreenable":false,
    "frame":false
  });
  // win.setTitle('Hedgehogs');

  // デベロッパーツール
  // win.webContents.openDevTools();

  // const menu = Menu.buildFromTemplate(editMenu);
  // Menu.setApplicationMenu(menu);

  win.loadURL(`file://${__dirname}/index.html`);

  win.on('closed', () => {
    win = null
  });

}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (win === null) {
    createWindow();
  }
});

// shortcats設定
// max_size
app.on('ready', () => {
  // Register a 'CommandOrControl+Y' shortcut listener.
  globalShortcut.register('CommandOrControl+F', () => {
    win.maximize()
    // Do stuff when Y and either Command/Control is pressed.
  })
})

// default sizeに戻す
app.on('ready', () => {
  // Register a 'CommandOrControl+Y' shortcut listener.
  globalShortcut.register('Shift+CommandOrControl+F', () => {
    win.unmaximize()
    // Do stuff when Y and either Command/Control is pressed.
  })
})

// show window
app.on('ready', () => {
  // Register a 'CommandOrControl+Y' shortcut listener.
  globalShortcut.register('CommandOrControl+S', () => {
    win.show(); 
    // Do stuff when Y and either Command/Control is pressed.
  })
})



