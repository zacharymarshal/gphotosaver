'use strict';

const {app} = require('electron');

const Auth = require('./auth');
const config = require('./config');
const Keychain = require('./auth/keychain');
const log = require('./log');

const auth = new Auth();

app.on('ready', () => {
  config.init(1, () => {
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
  log.init({
    level: config.get('log.level'),
    maxFileSize: config.get('log.maxFileSize'),
  });
  auth.init({
    log: log,
    clientId: config.get('auth.client_id'),
    clientSecret: config.get('auth.client_secret'),
    port: config.get('auth.port'),
    scopes: [
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/photoslibrary.readonly',
    ],
    keychain: new Keychain({
      service: config.get('keychain.service'),
    }),
  });
});

exports.config = config;
exports.log = log;
exports.auth = auth;
