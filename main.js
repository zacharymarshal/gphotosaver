'use strict';

const {app, BrowserWindow} = require('electron');
const {log, config} = require('./app');

let win;

app.on('ready', () => {
  log.debug('app starting up');
  log.debug('config file "%s"', config.getConfigPath());
  log.debug('log file "%s"', log.getLogPath());

  createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
});

app.on('activate', () => {
  if (win === null) {
    createWindow();
  }
});

function createWindow() {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  });
  win.loadFile('index.html');
  win.webContents.openDevTools();
  win.on('closed', () => {
    win = null
  });
}
