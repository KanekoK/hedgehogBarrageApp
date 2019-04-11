'use strict';

const {app, BrowserWindow, Menu, ipcMain} = require('electron');
let mainWindow;
let commentWindow;



// メニュー
let mainMenuTemplate = [{
  label: 'Hedgehogs',
  submenu: [
    { label: '画面最大化',
    accelerator: 'CommandOrControl+F',
    click: function() {
      mainWindow.maximize();
    }},
    { type: 'separator'},
    { label: '画面を通常の大きさに戻す',
    accelerator: 'Shift+CommandOrControl+F',
    click: function() {
      mainWindow.unmaximize();
    }},
    { type: 'separator'},
    { label: '画面を表示',
    accelerator: 'CommandOrControl+S',
    click: function() {
      mainWindow.show();
    }},
    { type: 'separator'},
    { label: 'コメント画面表示',
    accelerator: 'CommandOrControl+C',
    click: function() {
      mainMinimize();
    }},
    { type: 'separator'},
    { label: '閉じる',
    accelerator: 'CommandOrControl+Q',
    click: function() {
      app.quit();
    }},
    { type: 'separator'},
    { label: 'Toggle &Developer Tools',
    accelerator: 'Alt+CommandOrControl+I',
    click: function() { mainWindow.toggleDevTools();
    }},
    { type: 'separator'},
    { label: '枠線を透過',
    accelerator: 'CommandOrControl+E',
    click: function() {
      mainWindow.webContents.send('border_transparent');
    }},
    { type: 'separator'},
    { label: '枠線を可視化',
    accelerator: 'Shift+CommandOrControl+E',
    click: function() {
      mainWindow.webContents.send('border_visual');
    }},
  ]
}];

// メニュー
let commentMenuTemplate = [{
  label: 'Hedgehogs',
  submenu: [
    { label: '画面最大化',
    accelerator: 'CommandOrControl+F',
    click: function() {
      commentWindow.maximize();
    }},
    { type: 'separator'},
    { label: '画面を通常の大きさに戻す',
    accelerator: 'Shift+CommandOrControl+F',
    click: function() {
      commentWindow.unmaximize();
    }},
    { type: 'separator'},
    { label: '画面を表示',
    accelerator: 'CommandOrControl+S',
    click: function() {
      commentWindow.show();
    }},
    { type: 'separator'},
    { label: 'メイン画面表示',
    accelerator: 'CommandOrControl+C',
    click: function() {
      commentMinimize();
    }},
    { type: 'separator'},
    { label: '閉じる',
    accelerator: 'CommandOrControl+Q',
    click: function() {
      app.quit();
    }},
    { type: 'separator'},
    { label: 'Toggle &Developer Tools',
    accelerator: 'Alt+CommandOrControl+I',
    click: function() { mainWindow.toggleDevTools();
    }},
  ]
}];

// メニューのビルド
let mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
let commentMenu = Menu.buildFromTemplate(commentMenuTemplate);



// コメント弾幕が流れるメイン画面
function createMainWindow () {

  Menu.setApplicationMenu(mainMenu);

  mainWindow = new BrowserWindow({
    // "fullscreen": true,
    // "itleBarStyle": "hidden",
    "transparent": true,
    "alwaysOnTop": true,
    "nodeIntegration": false,
    "fullscreenable":false,
    "frame":false,
  });
  // mainWindow.setTitle('Hedgehogs');

  // デベロッパーツール
  // mainWindow.webContents.openDevTools();
  

  mainWindow.loadURL(`file://${__dirname}/index.html`);

  mainWindow.on('closed', () => {
    mainWindow = null
  });
  commentWindow.minimize();
}

// コメントログやコメントグラフの画面
function showCommentWindow () {
  Menu.setApplicationMenu(commentMenu);
  commentWindow = new BrowserWindow({
    // "fullscreen": true,
    // "itleBarStyle": "hidden",
    // "transparent": true,
    // "alwaysOnTop": true,
    // "nodeIntegration": false,
    // "fullscreenable":false,
    // "frame":false
  });
  commentWindow.loadURL(`file://${__dirname}/comment.html`);
  commentWindow.show();
  commentWindow.webContents.openDevTools();

  commentWindow.on('closed', () => {
    commentWindow = null
  });
}

app.on('ready', showCommentWindow);
app.on('ready', createMainWindow);


app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createMainWindow();
  }
});


ipcMain.on('engagement', function(event, data) {
  commentWindow.webContents.send('set_data', data);
});
ipcMain.on('comment', function(event, comment) {
  commentWindow.webContents.send('comment', comment);
});

function commentMinimize(){
  commentWindow.minimize();
  mainWindow.show();
  Menu.setApplicationMenu(mainMenu);
}


function mainMinimize(){
  mainWindow.minimize();
  commentWindow.show();
  Menu.setApplicationMenu(commentMenu);
}
