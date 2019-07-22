'use strict';

const {app} = require('electron');
const Auth = require('./auth');
const Config = require('./config');
const Keychain = require('./auth/keychain');
const Log = require('./log');
const TokenManager = require('./auth/tokenManager');

module.exports = {
  get config() {
    const config = new Config(app.getPath('userData') + '/config.json');
    config.open(1, config => {
      if (!config.has('keychain.service')) {
        config.set('keychain.service', 'com.theweekendprogrammer.gphotosaver');
      }
      if (!config.has('auth.client_id')) {
        config.set('auth.client_id', '1008426436981-qipod5tdqsklaq3ik5pfted2bhp5hegg.apps.googleusercontent.com');
      }
      if (!config.has('auth.client_secret')) {
        config.set('auth.client_secret', 'qNZ0BdGf049Id8Xd9ZjB3JBo');
      }
      if (!config.has('auth.port')) {
        config.set('auth.port', '16888');
      }
      if (!config.has('log.level')) {
        config.set('log.level', 'silly');
      }
      if (!config.has('log.maxFileSize')) {
        config.set('log.maxFileSize', '1048576');
      }
    });
    return config;
  },
  get log() {
    const log = new Log({
      level: this.config.get('log.level'),
      maxFileSize: this.config.get('log.maxFileSize'),
    });
    log.init();
    return log;
  },
  get auth() {
    return new Auth({
      log: this.log,
      clientId: this.config.get('auth.client_id'),
      clientSecret: this.config.get('auth.client_secret'),
      port: this.config.get('auth.port'),
      scopes: [
        'https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/photoslibrary.readonly',
      ],
      tokenManager: new TokenManager({
        config: this.config,
        keychain: new Keychain({
          service: this.config.get('keychain.service'),
        }),
      }),
    });
  }
};
