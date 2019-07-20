'use strict';

const log = require('./log');
const config = require('./config');
const signinPopup = require('./signinPopup');
const fetchAccessTokens = require('./fetchAccessTokens');
const keytar = require('keytar');

module.exports = () => {
  signinPopup().then(code => {
    log.debug('auth code "%s"', code);
    return fetchAccessTokens(code).then(tokens => {
      log.debug('auth tokens %j', tokens);
      keytar.setPassword(
        config.get('keychain.service'),
        'refresh_token',
        tokens.refresh_token,
      );
      keytar.setPassword(
        config.get('keychain.service'),
        'access_token',
        tokens.access_token,
      );
    });
  });
};
