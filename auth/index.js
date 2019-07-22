'use strict';

const fetchAccessTokens = require('./fetchAccessTokens');
const refreshAccessToken = require('./refreshAccessToken');
const popup = require('./popup');
const qs = require('querystring');

module.exports = class Auth {
  log;
  tokenManager;
  clientId;
  clientSecret;
  port;
  scopes;
  constructor(options) {
    this.log = options.log;
    this.tokenManager = options.tokenManager;
    this.clientId = options.clientId;
    this.clientSecret = options.clientSecret;
    this.port = options.port;
    this.scopes = options.scopes;
  }

  getLoginUrl() {
    const params = {
      client_id: this.clientId,
      redirect_uri: this.getRedirectUri(),
      response_type: 'code',
      scope: this.scopes.join(' '),
    };
    return 'https://accounts.google.com/o/oauth2/v2/auth?' +
      qs.stringify(params);
  }

  getRedirectUri() {
    return `http://localhost:${this.port}`;
  }

  lookupAccessToken() {
    if (this.tokenManager.accessTokenHasExpired()) {
      this.log.info('auth.lookupAccessToken - refreshing token...');
      this.tokenManager.lookupRefreshToken().then(refreshToken => {
        return refreshAccessToken({
          log: this.log,
          refreshToken: refreshToken,
          clientId: this.clientId,
          clientSecret: this.clientSecret,
        });
      }).then(({accessToken, refreshToken, expiresIn}) => {
        this.tokenManager.persistTokens({accessToken, refreshToken, expiresIn});
        return accessToken;
      });
    }
    return this.tokenManager.lookupAccessToken()
      .then(accessToken => {
        this.log.debug('auth.lookupAccessToken - access token %s', accessToken);
        return accessToken || this.fetchToken();
      });
  }

  fetchToken() {
    this.log.info('auth - start process to get oauth token...');
    this.log.info('auth - getting google auth code...');
    popup({
      loginUrl: this.getLoginUrl(),
      port: this.port,
      log: this.log,
    }).then(code => {
      this.log.info('auth - received google auth code');
      return code;
    }).then(code => {
      this.log.info('auth - getting google auth tokens...');
      return fetchAccessTokens({
        log: this.log,
        code: code,
        clientId: this.clientId,
        clientSecret: this.clientSecret,
        redirectUri: this.getRedirectUri(),
      });
    }).then(({accessToken, refreshToken, expiresIn}) => {
      this.tokenManager.persistTokens({accessToken, refreshToken, expiresIn});
      return accessToken;
    });
  }
};
