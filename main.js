/* jshint undef: true, unused: true */
/* globals require, __dirname, process */
const {app, BrowserWindow} = require('electron');
const path = require('path');
const url = require('url');

let win;
function createWindow(){
  win = new BrowserWindow({
    "height": 600,
    // potential electron bug, minWidth doesn't match DOM's width (8px of extra window space on all sides?)
    "minWidth": 363 + 16,
    "width": 1100 + 16,
    "maxWidth": 1100 + 16,
    "maximizable": false
  });
  win.setMenu(null);

  win.loadURL(url.format({
    "pathname": path.join(__dirname, "index.html"),
    "protocol": "file:",
    "slashes": true
  }));

  //win.webContents.openDevTools();

  win.on("closed", () => {
    win = null;
  });
}

const shouldQuit = app.makeSingleInstance(() => {
  if( win ){
    if( win.isMinimized() ){
      win.restore();
    }
    win.focus();
  }
});

if( shouldQuit ){
  app.quit();
}

app.on("ready", createWindow);

app.on("window-all-closed", () => {
  if( process.platform !== "darwin" ){
    app.quit();
  }
});

app.on("active", () => {
  if( win === null ){
    createWindow();
  }
});
