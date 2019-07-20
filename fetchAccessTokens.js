'use strict';

const axios = require('axios');
const querystring = require('querystring');

const config = require('./config');
const log = require('./log');

module.exports = function fetchAccessTokens(code) {
  return new Promise((resolve, reject) => {
    log.debug('auth requesting access tokens');
    axios.post(
      'https://www.googleapis.com/oauth2/v4/token',
      querystring.stringify({
        code,
        client_id: config.get('auth.client_id'),
        client_secret: config.get('auth.client_secret'),
        redirect_uri: 'http://localhost:' + config.get('auth.port'),
        grant_type: 'authorization_code',
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    ).then(res => {
      resolve(res.data)
    })
    .catch(err => reject(err));
  });
};
