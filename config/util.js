'use strict';

const {format} = require('util');

const search = exports.search = (object, keys) => {
  if (typeof keys === 'string') {
    return search(object, keys.split('.'));
  }
  if (keys.length === 0) {
    return object;
  }
  if (!object[keys[0]]) {
    return undefined;
  }
  return search(object[keys[0]], keys.slice(1));
};

const set = exports.set = (object, keys, value) => {
  if (typeof keys === 'string') {
    return set(object, keys.split('.'), value);
  }
  if (keys.length === 1) {
    return object[keys[0]] = value;
  }
  if (typeof object[keys[0]] !== 'object') {
    object[keys[0]] = {};
  }
  return set(object[keys[0]], keys.slice(1), value);
};

