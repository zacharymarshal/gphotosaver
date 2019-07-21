'use strict';

const keytar = require('keytar');

module.exports = class Keychain {
  constructor(options) {
    this.service = options.service;
  }

  getAccessToken() {
    return keytar.getPassword(this.service, 'access_token');
  }

  getRefreshToken() {
    return keytar.getPassword(this.service, 'refresh_token');
  }

  setTokens(accessToken, refreshToken) {
    keytar.setPassword(this.service, 'access_token', accessToken);
    if (refreshToken) {
      keytar.setPassword(this.service, 'refresh_token', refreshToken);
    }
  }
};
