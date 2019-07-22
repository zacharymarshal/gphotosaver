'use strict';

module.exports = class TokenManager {
  constructor({keychain, config}) {
    this.config = config;
    this.keychain = keychain;
  }
  lookupRefreshToken() {
    return this.keychain.getRefreshToken();
  }
  lookupAccessToken() {
    return this.keychain.getAccessToken();
  }
  persistTokens({accessToken, refreshToken, expiresIn}) {
    return this.keychain.saveTokens(accessToken, refreshToken)
      .then(() => {
        const expiresAt = Date.now() + (expiresIn * 1000);
        this.config.set('auth.accessTokenExpiresAt', expiresAt);
      });
  }
  accessTokenHasExpired() {
    const expiresAt = this.config.get('auth.accessTokenExpiresAt');
    return !!(expiresAt && expiresAt < Date.now());
  }
};
