const language_field_filter = require('../../post/language_field_filter');
const Document = require('../../Document');
const _ = require('lodash');

const generateDocument = () => {
  const doc = new Document('mysource', 'mylayer', 'myid');

  doc.setName('default', 'test1');
  doc.setNameAlias('default', 'test2');
  doc.setNameAlias('default', 'test3');

  doc.setName('en', 'test4');
  doc.setNameAlias('en', 'test3');
  doc.setNameAlias('en', 'test5');

  doc.setName('de', 'test6');

  doc.setName('fr', 'test7');

  return doc;
};

const generateFakeConfig = (config) => {
  return { get: _.get.bind(null, config) };
};

module.exports.tests = {};

module.exports.tests.filter = function (test) {
  test('filter - empty config', function (t) {
    const fakeConfig = generateFakeConfig({});
    const doc = generateDocument();

    language_field_filter(fakeConfig)(doc);

    t.deepEquals(doc, generateDocument());

    t.end();
  });

  test('filter - langs as string', function (t) {
    const fakeConfig = generateFakeConfig({ imports: { langs: 'en' } });
    const doc = generateDocument();

    language_field_filter(fakeConfig)(doc);

    t.ok(doc.name.default, 'default should be truthy');
    t.ok(doc.phrase.default, 'default should be truthy');

    t.ok(doc.name.en, 'en should be truthy');
    t.ok(doc.phrase.en, 'en should be truthy');

    t.false(doc.name.de, 'de should be falsy');
    t.false(doc.phrase.de, 'default should be falsy');

    t.false(doc.name.fr, 'fr should be falsy');
    t.false(doc.phrase.fr, 'fr should be falsy');

    t.end();
  });

  test('filter - langs as array', function (t) {
    const fakeConfig = generateFakeConfig({ imports: { langs: ['en', 'de'] } });
    const doc = generateDocument();

    language_field_filter(fakeConfig)(doc);

    t.ok(doc.name.default, 'default should be truthy');
    t.ok(doc.phrase.default, 'default should be truthy');

    t.ok(doc.name.en, 'en should be truthy');
    t.ok(doc.phrase.en, 'en should be truthy');

    t.ok(doc.name.de, 'de should be truthy');
    t.ok(doc.phrase.de, 'de should be truthy');

    t.false(doc.name.fr, 'fr should be falsy');
    t.false(doc.phrase.fr, 'fr should be falsy');

    t.end();
  });

  test('filter - keep as string', function (t) {
    const fakeConfig = generateFakeConfig({ imports: { langs: { keep: 'en' } } });
    const doc = generateDocument();

    language_field_filter(fakeConfig)(doc);

    t.ok(doc.name.default, 'default should be truthy');
    t.ok(doc.phrase.default, 'default should be truthy');

    t.ok(doc.name.en, 'en should be truthy');
    t.ok(doc.phrase.en, 'en should be truthy');

    t.false(doc.name.de, 'de should be falsy');
    t.false(doc.phrase.de, 'default should be falsy');

    t.false(doc.name.fr, 'fr should be falsy');
    t.false(doc.phrase.fr, 'fr should be falsy');

    t.end();
  });

  test('filter - keep as array', function (t) {
    const fakeConfig = generateFakeConfig({ imports: { langs: { keep: ['en', 'de'] } } });
    const doc = generateDocument();

    language_field_filter(fakeConfig)(doc);

    t.ok(doc.name.default, 'default should be truthy');
    t.ok(doc.phrase.default, 'default should be truthy');

    t.ok(doc.name.en, 'en should be truthy');
    t.ok(doc.phrase.en, 'en should be truthy');

    t.ok(doc.name.de, 'de should be truthy');
    t.ok(doc.phrase.de, 'de should be truthy');

    t.false(doc.name.fr, 'fr should be falsy');
    t.false(doc.phrase.fr, 'fr should be falsy');

    t.end();
  });
};

module.exports.all = function (tape, common) {
  function test(name, testFunction) {
    return tape('post/language_field_filter: ' + name, testFunction);
  }

  for (var testCase in module.exports.tests) {
    module.exports.tests[testCase](test, common);
  }
};
