'use strict';

const electron = require('electron');
const BrowserWindow = (electron.BrowserWindow || electron.remote.BrowserWindow);
const querystring = require('querystring');
const http = require('http');
const url = require('url');

const config = require('./config');
const log = require('./log');

let authWindow;
const createAuthWindow = () => {
  authWindow = new BrowserWindow({
    width: 500,
    height: 600,
    show: true,
  });
  authWindow.on('closed', () => {
    authWindow = null
  });

  const params = {
    'client_id': config.get('auth.client_id'),
    'redirect_uri': 'http://localhost:' + config.get('auth.port'),
    'response_type': 'code',
    'scope': 'profile ' +
      'https://www.googleapis.com/auth/photoslibrary.readonly',
  };
  authWindow.loadURL('https://accounts.google.com/o/oauth2/v2/auth?' +
    querystring.stringify(params));
};

module.exports = function signinPopup() {
  createAuthWindow();
  return new Promise((resolve, reject) => {
    const port = 16888;
    let handler = req => {
      const query = url.parse(req.url).query;
      const params = querystring.parse(query);
      server.close(() => {
        log.debug('auth server shutdown');
      });
      resolve(params.code);
    };
    const server = http.createServer(handler);
    server.listen(port, err => {
      if (err) {
        return reject(err);
      }
      log.debug('auth server running on :%d', port);
    });
  }).then(code => {
    authWindow.close();
    return code;
  });
};
