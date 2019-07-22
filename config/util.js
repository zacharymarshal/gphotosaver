'use strict';

const search = exports.search = (object, keys) => {
  if (keys.length === 0) {
    return object;
  }
  if (!object[keys[0]]) {
    return undefined;
  }
  return search(object[keys[0]], keys.slice(1));
};

const set = exports.set = (object, keys, value) => {
  if (keys.length === 1) {
    return object[keys[0]] = value;
  }
  if (!object[keys[0]]) {
    object[keys[0]] = {};
  }
  return set(object[keys[0]], keys.slice(1), value);
};

