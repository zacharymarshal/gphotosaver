'use strict';

const config = require('electron-json-config');

exports.init = () => {
  if (config.has('auth')) {
    return;
  }
  config.setBulk({
    'keychain.service': 'com.theweekendprogrammer.gphotosaver',
    'auth.client_id': '',
    'auth.client_secret': '',
    'auth.port': '16888',
    'log.level': 'silly',
    'log.maxFileSize': '1048576',
  });
};

exports.get = (key, defaultValue) => {
  return config.get(key, defaultValue);
};

exports.file = () => {
  return config.file();
};
