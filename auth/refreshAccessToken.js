'use strict';

const axios = require('axios');
const qs = require('querystring');

module.exports = ({log, refreshToken, clientId, clientSecret}) => {
  const url = 'https://www.googleapis.com/oauth2/v4/token';
  const params = qs.stringify({
    refresh_token: refreshToken,
    client_id: clientId,
    client_secret: clientSecret,
    grant_type: 'refresh_token',
  });
  log.debug('auth/refreshTokens - requesting %s?%s', url, params);
  return axios.post(url, params, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  }).then(res => {
    log.debug('auth/refreshTokens - response %j', res.data);
    return {
      refreshToken,
      accessToken: res.data.access_token,
      expiresIn: res.data.expires_in,
    };
  });
};
