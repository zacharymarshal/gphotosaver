'use strict';

const config = require('electron-json-config');

exports.init = (version, upgradeCallback) => {
  if (version === config.get('__version')) {
    return;
  }
  config.set('__version', version);
  upgradeCallback(version);
};

exports.get = (key, defaultValue) => {
  return config.get(key, defaultValue);
};

exports.file = () => {
  return config.file();
};

exports.setBulk = items => {
  return config.setBulk(items);
};

exports.has = key => {
  return config.has(key);
};

exports.set = (key, value) => {
  return config.set(key, value);
};
