
var Document = require('../../Document');
var deduplication = require('../../post/deduplication');

module.exports.tests = {};

module.exports.tests.dedupe = function (test) {
  test('dedupe - name', function (t) {
    var doc = new Document('mysource', 'mylayer', 'myid');

    doc.setNameAlias('default', 'test');
    doc.setName('default', 'test');
    doc.setNameAlias('default', 'test');
    doc.setNameAlias('default', 'test 2');
    doc.setNameAlias('default', 'test');

    deduplication(doc);
    t.deepEquals(doc.name.default, ['test', 'test 2']);

    t.end();
  });
  test('dedupe - address_parts', function (t) {
    var doc = new Document('mysource', 'mylayer', 'myid');

    doc.setAddressAlias('street', 'test');
    doc.setAddress('street', 'test');
    doc.setAddressAlias('street', 'test');
    doc.setAddressAlias('street', 'test 2');
    doc.setAddressAlias('street', 'test');

    deduplication(doc);
    t.deepEquals(doc.address_parts.street, ['test', 'test 2']);

    t.end();
  });
};

module.exports.all = function (tape, common) {

  function test(name, testFunction) {
    return tape('post/deduplication: ' + name, testFunction);
  }

  for (var testCase in module.exports.tests) {
    module.exports.tests[testCase](test, common);
  }
};
