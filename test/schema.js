const schema = require('../schema');

function validate(config) {
  const result = schema.validate(config);
  if (result.error) {
    throw new Error(result.error.details[0].message);
  }
}

module.exports.tests = {};

module.exports.tests.schema = function (test) {
  test('missing imports should not throw error', function (t) {
    t.doesNotThrow(validate.bind(null, {}));
    t.end();
  });

  test('missing langs should not throw error', function (t) {
    t.doesNotThrow(validate.bind(null, { imports: {}}));
    t.end();
  });

  test('missing keep/default should not throw error', function (t) {
    t.doesNotThrow(validate.bind(null, { imports: { langs: {}}}));
    t.end();
  });

  test('correct values should not throw error', function (t) {
    t.doesNotThrow(validate.bind(null, { imports: { langs: { keep: ['en'], default: 'en'}}}));
    t.doesNotThrow(validate.bind(null, { imports: { langs: { keep: 'en', default: 'en'}}}));
    t.doesNotThrow(validate.bind(null, { imports: { langs: 'en' }}));
    t.end();
  });

  test('incorrect `langs` languages should throw error', function (t) {
    t.throws(validate.bind(null, { imports: { langs:  ['english']}}));
    t.throws(validate.bind(null, { imports: { langs:  [123]}}));
    t.throws(validate.bind(null, { imports: { langs:  'english'}}));
    t.throws(validate.bind(null, { imports: { langs:  123}}));
    t.end();
  });

  test('incorrect `langs.keep` languages should throw error', function (t) {
    t.throws(validate.bind(null, { imports: { langs: { keep: ['english']}}}));
    t.throws(validate.bind(null, { imports: { langs: { keep: [123]}}}));
    t.throws(validate.bind(null, { imports: { langs: { keep: 'english'}}}));
    t.throws(validate.bind(null, { imports: { langs: { keep: 123}}}));
    t.end();
  });

  test('incorrect `langs.default` languages should throw error', function (t) {
    t.throws(validate.bind(null, { imports: { langs: { default: ['english']}}}));
    t.throws(validate.bind(null, { imports: { langs: { default: [123]}}}));
    t.throws(validate.bind(null, { imports: { langs: { default: 'english'}}}));
    t.throws(validate.bind(null, { imports: { langs: { default: 123}}}));
    t.end();
  });
};

module.exports.all = function (tape, common) {
  function test(name, testFunction) {
    return tape('schema: ' + name, testFunction);
  }

  for (var testCase in module.exports.tests) {
    module.exports.tests[testCase](test, common);
  }
};
