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

  saveTokens(accessToken, refreshToken) {
    return Promise.all([
      keytar.setPassword(this.service, 'access_token', accessToken),
      keytar.setPassword(this.service, 'refresh_token', refreshToken),
    ]);
  }
};
