'use strict';

const log = require('electron-log');
const {format} = require('util');

module.exports = class Log {
  level;
  maxFileSize;
  constructor(options) {
    this.level = options.level || 'silly';
    this.maxFileSize = options.maxFileSize || '1048576';
  }
  init() {
    log.transports.console.level = this.level;
    log.transports.file.level = this.level;
    log.transports.file.maxSize = this.maxFileSize;
    log.catchErrors({
      showDialog: false,
    });
  }
  getLogPath() {
    return log.transports.file.findLogPath();
  }
  error(msg, ...args) {
    log.error(format(msg, ...args));
  }
  warn(msg, ...args) {
    log.warn(format(msg, ...args));
  }
  info(msg, ...args) {
    log.info(format(msg, ...args));
  }
  verbose(msg, ...args) {
    log.verbose(format(msg, ...args));
  }
  debug(msg, ...args) {
    log.debug(format(msg, ...args));
  }
  silly(msg, ...args) {
    log.silly(format(msg, ...args));
  }
};
