'use strict';

const {search, set} = require('./util');
const {
  initConfigFile,
  readConfigFile,
  writeConfigFile,
} = require('./configFile');

module.exports = class Config {
  file;
  config;
  constructor(file) {
    this.file = file;
  }

  getConfigPath() {
    return this.file;
  }

  open(version, upgradeCallback) {
    initConfigFile(this.file);
    this.config = readConfigFile(this.file);
    if (version === this.get('__version')) {
      return;
    }
    this.set('__version', version);
    upgradeCallback(this);
  }

  get(key, defaultValue) {
    let keys = key.split('.');
    return search(this.config, keys) || defaultValue;
  }

  set(key, value) {
    let keys = key.split('.');
    set(this.config, keys, value);
    writeConfigFile(this.file, this.config);
  }

  setBulk(items) {
    for (let key in items) {
      let keys = key.split('.');
      set(this.config, keys, items[key]);
    }
    writeConfigFile(this.file, this.config);
  }

  has(key) {
    let keys = key.split('.');
    return search(this.config, keys) !== undefined;
  }

  all() {
    return this.config;
  }
};
