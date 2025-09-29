const fs = require('fs');
const os = require('os');
const path = require('path');
const Document = require('../../Document');
const patch = require('../../post/patch');

module.exports.tests = {};

module.exports.tests.noop = function (test) {
  test('empty setOperations - no-op', (t) => {
    var doc = new Document('geonames', 'county', '3333219');
    patch.load();
    patch(doc);
    t.deepEquals(doc.name, {});
    t.end();
  });
};

module.exports.tests.foo = function (test) {
  test('valid setOperations - update name', (t) => {
    var doc = new Document('geonames', 'county', '3333219');
    useFixtures(() => {
      patch.load();
      patch(doc);
      t.deepEquals(doc.name, { default: [ 'Los Angeles County' ] });
      t.end();
    });
  });
};

module.exports.all = function (tape, common) {
  function test(name, testFunction) {
    return tape('post/patch: ' + name, testFunction);
  }
  for (var testCase in module.exports.tests) {
    module.exports.tests[testCase](test, common);
  }
};

// convenience test function loads all fixtures in the fixtures/patch directory
function useFixtures(fn) {
  const files = [path.join(__dirname, 'fixtures', 'patch', '*')];

  const peliasConfig = path.join(os.tmpdir(), `pelias-${Date.now()}.json`);
  fs.writeFileSync(peliasConfig, JSON.stringify({ imports: { patch: { files } } }));

  process.env.PELIAS_CONFIG = peliasConfig;
  fn();
  delete process.env.PELIAS_CONFIG;
  fs.unlinkSync(peliasConfig);
}