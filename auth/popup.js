'use strict';

const electron = require('electron');
const BrowserWindow = (electron.BrowserWindow || electron.remote.BrowserWindow);
const qs = require('querystring');
const http = require('http');
const url = require('url');

let window;
const openWindow = url => {
  window = new BrowserWindow({
    width: 500,
    height: 600,
    show: true,
  });
  window.on('closed', () => {
    window = null
  });
  window.loadURL(url);
  return window;
};

module.exports = (options) => {
  const log = options.log;
  const loginUrl = options.loginUrl;
  const port = options.port;

  const loginWindow = openWindow(loginUrl);
  return new Promise((resolve, reject) => {
    let handler = req => {
      const query = url.parse(req.url).query;
      const params = qs.parse(query);
      server.close(() => {
        log.debug('auth/popup - redirect server shutdown');
      });
      resolve(params.code);
    };
    const server = http.createServer(handler);
    server.listen(port, err => {
      if (err) {
        return reject(err);
      }
      log.debug('auth/popup - redirect server listening on :%d', port);
    });
  }).then(code => {
    loginWindow.close();
    return code;
  });
};
