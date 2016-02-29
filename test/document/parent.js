
var Document = require('../../Document');

module.exports.tests = {};

module.exports.tests.addParent = function(test) {
  test('addParent', function(t) {
    var doc = new Document('mysource','mylayer','myid');
    t.equal(doc.addParent('country','liberland', 'liber_id', 'liber_abbr'), doc, 'chainable');
    t.equal(doc.parent.country[0], 'liberland', 'adder works');
    t.equal(doc.parent.country_id[0], 'liber_id', 'adder works');
    t.equal(doc.parent.country_a[0], 'liber_abbr', 'adder works');
    t.end();
  });
  test('addParent - omit abbr', function(t) {
    var doc = new Document('mysource','mylayer','myid');
    t.equal(doc.addParent('country','liberland', 'liber_id'), doc, 'chainable');
    t.equal(doc.parent.country[0], 'liberland', 'adder works');
    t.equal(doc.parent.country_id[0], 'liber_id', 'adder works');
    t.equal(doc.parent.country_a[0], null, 'adder works');
    t.end();
  });
  test('addParent - validate', function(t) {
    var doc = new Document('mysource','mylayer','myid');
    t.throws( doc.addParent.bind(doc, 1), null, 'invalid type' );
    t.throws( doc.addParent.bind(doc, ''), null, 'invalid length' );
    t.throws( doc.addParent.bind(doc, 'foo', 1), null, 'invalid property' );
    t.throws( doc.addParent.bind(doc, '4', 2), null, 'invalid property' );
    t.throws( doc.addParent.bind(doc, 'country', 2), null, 'invalid property' );
    t.throws( doc.addParent.bind(doc, 'country', true), null, 'invalid property' );
    t.throws( doc.addParent.bind(doc, 'country', null), null, 'invalid property' );
    t.throws( doc.addParent.bind(doc, 'country', '\n'), null, 'invalid property' );
    t.equal(doc.parent.street, undefined, 'property unchanged');
    t.doesNotThrow( doc.addParent.bind(doc, 'country', 'foo', 'bar','baz'), null, 'valid property' );
    t.doesNotThrow( doc.addParent.bind(doc, 'country', '1', '1', '1'), null, 'valid property' );
    t.end();
  });
};

module.exports.all = function (tape, common) {

  function test(name, testFunction) {
    return tape('parent: ' + name, testFunction);
  }

  for( var testCase in module.exports.tests ){
    module.exports.tests[testCase](test, common);
  }
};
