'use strict';

const axios = require('axios');

module.exports = (options) => {
  const log = options.log;
  const authToken = options.authToken;
  const params = options.params || {};
  params.pageSize = 100;

  log.info('searching google photos...');
  return new Promise((resolve, reject) => {
    axios.post(
      '/v1/mediaItems:search',
      params,
      {
        baseURL: 'https://photoslibrary.googleapis.com',
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
      }
    ).then(res => {
      resolve(res.data.mediaItems);
    }).catch(err => {
      log.debug(err.config);
      log.error(err.response.data);
      reject(err);
    });
  });
};
