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

  // const SERVICE = 'com.theweekendprogrammer.gphotosaver';
  // keytar.findCredentials(SERVICE).then(creds => {
  //   console.log(creds);
  // });
  // signinPopup().then(code => {
  //   console.log(code);
  //   return fetchAccessTokens(code).then(tokens => {
  //     keytar.setPassword(
  //       SERVICE,
  //       'refresh_token',
  //       tokens.refresh_token,
  //     );
  //     keytar.setPassword(
  //       SERVICE,
  //       'access_token',
  //       tokens.access_token,
  //     );
  //   });
  // }).then(() => {
  //   keytar.getPassword(SERVICE, 'refresh_token')
  //     .then(token => {
  //       console.log(token);
  //     });
  // });
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
