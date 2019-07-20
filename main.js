'use strict';

const {app, BrowserWindow} = require('electron');
const signinPopup = require('./signinPopup');
const fetchAccessTokens = require('./fetchAccessTokens');
const keytar = require('keytar');
const config = require('./config');
const log = require('./log');

config.init();
log.init({
  level: config.get('log.level'),
  maxFileSize: config.get('log.maxFileSize'),
});
log.debug('app starting up');
log.debug('config file "%s"', config.file());
log.debug('log file "%s"', log.file());

let win;

app.on('ready', () => {
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
