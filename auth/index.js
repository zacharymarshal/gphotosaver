'use strict';

const fetchAccessTokens = require('./fetchAccessTokens');
const popup = require('./popup');
const qs = require('querystring');

module.exports = class Auth {
  log;
  keychain;
  clientId;
  clientSecret;
  port;
  scopes;
  constructor(options) {
    this.log = options.log;
    this.keychain = options.keychain;
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

  getToken() {
    return this.keychain.getAccessToken()
      .then(accessToken => {
        this.log.debug('auth.getToken - access token %s', accessToken);
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
    }).then(tokens => {
      this.keychain.setTokens(tokens.access_token, tokens.refresh_token);
      return tokens.access_token;
    });
  }
};
