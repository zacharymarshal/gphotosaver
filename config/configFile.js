'use strict';

const fs = require('fs');

exports.initConfigFile = file => {
  if (fs.existsSync(file)) {
    return;
  }
  try {
    fs.writeFileSync(file, '{}');
  } catch (err) {
    console.error(`could not create config file: ${err}`);
  }
};

exports.readConfigFile = file => {
  let config;
  try {
    config = JSON.parse(fs.readFileSync(file));
  } catch (err) {
    console.error(`could not read config file: ${err}`);
  }
  return config;
};

exports.writeConfigFile = (file, config) => {
  try {
    fs.writeFileSync(file, JSON.stringify(config));
  } catch (err) {
    console.error(`could not write config file: ${err}`);
  }
};
