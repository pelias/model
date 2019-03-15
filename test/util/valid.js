const valid = require('../../util/valid');

module.exports.tests = {};

module.exports.tests.nonnegative = (test) => {
  test('nonnegative should throw error if value is less than 0', (t) => {
    t.throws(valid.nonnegative.bind(null, -1), /invalid document type, expecting: 0 or a positive number, got: -1/);
    t.end();
  });

  test('nonnegative should not throw error if value is 0', (t) => {
    t.doesNotThrow(valid.nonnegative.bind(null, 0), '0 should be allowed');
    t.end();
  });

  test('nonnegative should not throw error if value is greater than 0', (t) => {
    t.doesNotThrow(valid.nonnegative.bind(null, 1), '1 should be allowed');
    t.end();
  });

};

module.exports.tests.regex = (test) => {
  test('regex nomatch', (t) => {
    t.throws(valid.regex.nomatch.bind(null, 'hello', /he/), /invalid regex/);
    t.doesNotThrow(valid.regex.nomatch.bind(null, 'hello', /bye/), /invalid regex/);
    t.end();
  });
};

module.exports.all = (tape, common) => {

  function test(name, testFunction) {
    return tape(`valid: ${name}`, testFunction);
  }

  for( var testCase in module.exports.tests ){
    module.exports.tests[testCase](test, common);
  }
};
