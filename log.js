'use strict';

const log = require('electron-log');
const {format} = require('util');

exports.init = (options) => {
  log.transports.console.level = options.level;
  log.transports.file.level = options.level;
  log.transports.file.maxSize = options.maxFileSize;
  log.catchErrors({
    showDialog: false,
  });
};

exports.file = () => {
  return log.transports.file.findLogPath();
};

['error', 'warn', 'info', 'verbose', 'debug', 'silly'].forEach(level => {
  exports[level] = (msg, ...args) => {
    log[level](format(msg, ...args));
  }
});
