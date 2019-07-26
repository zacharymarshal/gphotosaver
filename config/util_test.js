const test = require('tape');
const {search, set} = require('./util');

test('search config utility', function (t) {
  const config = {
    dad: {name: 'zulu'},
    kids: 2,
    pet: {name: 'Henry', breed: {name: 'cockapoo'}},
  };

  const tests = [
    {key: 'dad.name', expectedValue: 'zulu'},
    {key: 'kids', expectedValue: 2},
    {key: 'pet.breed.name', expectedValue: 'cockapoo'},
  ];

  t.plan(tests.length);
  tests.forEach(test => {
    t.equals(search(config, test.key), test.expectedValue);
  });
});

test('config value not found', t => {
  t.plan(1);
  t.equals(search({}, 'pet.name'), undefined);
});

test('set config values utility', function (t) {
  const config = {};
  t.plan(1);
  set(config, 'name', 'zulu');
  t.equals(config.name, 'zulu');
});

test('update config value', function (t) {
  const config = {name: 'nobody', pet: {type: 'dog', name: 'henry'}};
  t.plan(3);
  set(config, 'name', 'zulu');
  set(config, 'pet.type', 'cat');

  t.equals(config.name, 'zulu');
  t.equals(config.pet.type, 'cat');
  t.equals(config.pet.name, 'henry');
});

test('set nested config value', function (t) {
  const config = {};
  t.plan(1);
  set(config, 'family.pet.name.first', 'henry');
  t.equals(config.family.pet.name.first, 'henry');
});

test('set value that is not found', function (t) {
  const config = {name: 'zach'};
  t.plan(1);
  set(config, 'name.first', 'zach');
  t.equals(config.name.first, 'zach');
});
