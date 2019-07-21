'use strict';

const fetchAccessTokens = require('./fetchAccessTokens');
const popup = require('./popup');
const qs = require('querystring');

module.exports = class Auth {
  init(options) {
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
    return new Promise((resolve, reject) => {
      this.keychain.getAccessToken().then(accessToken => {
        this.log.debug('auth.getToken - access token %s', accessToken);
        if (!accessToken) {
          this.fetchToken()
            .then(token => resolve(token))
            .catch(err => reject(err));
        } else {
          resolve(accessToken);
        }
      });
    });
  }

  fetchToken() {
    this.log.info('auth - start process to get oauth token...');
    return new Promise((resolve, reject) => {
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
        fetchAccessTokens({
          log: this.log,
          code: code,
          clientId: this.clientId,
          clientSecret: this.clientSecret,
          redirectUri: this.getRedirectUri(),
        }).then(tokens => {
          this.keychain.setTokens(tokens.access_token, tokens.refresh_token);
          resolve(tokens.access_token);
        }).catch(err => reject(err));
      }).catch(err => reject(err));
    });
  }
};
