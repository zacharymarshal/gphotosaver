'use strict';

const axios = require('axios');
const qs = require('querystring');

module.exports = options => {
  const log = options.log;
  const code = options.code;
  const clientId = options.clientId;
  const clientSecret = options.clientSecret;
  const redirectUri = options.redirectUri;

  return new Promise((resolve, reject) => {

    const url = 'https://www.googleapis.com/oauth2/v4/token';
    const params = qs.stringify({
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      grant_type: 'authorization_code',
    });
    log.debug('auth/tokens - requesting %s?%s', url, params);
    axios.post(url, params, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }).then(res => {
      this.log.debug('auth/tokens - response %j', res.data);
      resolve(res.data);
    }).catch(err => reject(err));
  });
};
