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
    return search(this.config, key) || defaultValue;
  }

  set(key, value) {
    set(this.config, key, value);
    writeConfigFile(this.file, this.config);
  }

  setBulk(items) {
    for (let key in items) {
      set(this.config, key, items[key]);
    }
    writeConfigFile(this.file, this.config);
  }

  has(key) {
    return search(this.config, key) !== undefined;
  }

  all() {
    return this.config;
  }
};
