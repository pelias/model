const language_default = require('../../post/language_default');
const Document = require('../../Document');
const _ = require('lodash');

const generateFakeConfig = (config) => {
  return { get: _.get.bind(null, config) };
};

module.exports.tests = {};

module.exports.tests.default = function (test) {
  test('default - empty config', function (t) {
    const fakeConfig = generateFakeConfig({});
    const doc = new Document('mysource', 'mylayer', 'myid');

    doc.setName('default', 'test1');
    doc.setNameAlias('default', 'test2');
    doc.setNameAlias('default', 'test3');

    doc.setName('en', 'test4');
    doc.setNameAlias('en', 'test3');
    doc.setNameAlias('en', 'test5');

    language_default(fakeConfig)(doc);

    t.deepEquals(doc.name.default, ['test1', 'test2', 'test3']);
    t.deepEquals(doc.phrase.default, ['test1', 'test2', 'test3']);

    t.end();
  });

  test('default - en with aliases', function (t) {
    const fakeConfig = generateFakeConfig({ imports: { langs: { default: 'en' } } });
    const doc = new Document('mysource', 'mylayer', 'myid');

    doc.setName('default', 'test1');
    doc.setNameAlias('default', 'test2');
    doc.setNameAlias('default', 'test3');

    doc.setName('en', 'test4');
    doc.setNameAlias('en', 'test3');
    doc.setNameAlias('en', 'test5');

    language_default(fakeConfig)(doc);

    t.deepEquals(doc.name.default, ['test4', 'test3', 'test5', 'test1', 'test2', 'test3']);
    t.deepEquals(doc.phrase.default, ['test4', 'test3', 'test5', 'test1', 'test2', 'test3']);

    t.end();
  });

  test('default - en without aliases', function (t) {
    const fakeConfig = generateFakeConfig({ imports: { langs: { default: 'en' } } });

    const doc = new Document('mysource', 'mylayer', 'myid');

    doc.setName('default', 'test1');
    doc.setNameAlias('default', 'test2');
    doc.setNameAlias('default', 'test3');

    doc.setName('en', 'test4');

    language_default(fakeConfig)(doc);

    t.deepEquals(doc.name.default, ['test4', 'test1', 'test2', 'test3']);
    t.deepEquals(doc.phrase.default, ['test4', 'test1', 'test2', 'test3']);

    t.end();
  });

  test('default - without en name', function (t) {
    const fakeConfig = generateFakeConfig({ imports: { langs: { default: 'en' } } });

    const doc = new Document('mysource', 'mylayer', 'myid');

    doc.setName('default', 'test1');
    doc.setNameAlias('default', 'test2');
    doc.setNameAlias('default', 'test3');

    language_default(fakeConfig)(doc);

    t.deepEquals(doc.name.default, ['test1', 'test2', 'test3']);
    t.deepEquals(doc.phrase.default, ['test1', 'test2', 'test3']);

    t.end();
  });

  test('default - without default name', function (t) {
    const fakeConfig = generateFakeConfig({ imports: { langs: { default: 'en' } } });

    const doc = new Document('mysource', 'mylayer', 'myid');

    doc.setName('en', 'test1');

    language_default(fakeConfig)(doc);

    t.deepEquals(doc.name.default, ['test1']);
    t.deepEquals(doc.phrase.default, ['test1']);

    t.deepEquals(doc.name.en, 'test1');
    t.deepEquals(doc.phrase.en, 'test1');

    t.end();
  });
};

module.exports.all = function (tape, common) {
  function test(name, testFunction) {
    return tape('post/language_default: ' + name, testFunction);
  }

  for (var testCase in module.exports.tests) {
    module.exports.tests[testCase](test, common);
  }
};
