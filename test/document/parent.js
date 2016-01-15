
var Document = require('../../Document');

module.exports.tests = {};

module.exports.tests.addParent = function(test) {
  test('addParent', function(t) {
    var doc = new Document('mysource','mylayer','myid');
    t.equal(doc.addParent('country','liberland'), doc, 'chainable');
    t.equal(doc.parent.country[0], 'liberland', 'adder works');
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
    t.doesNotThrow( doc.addParent.bind(doc, 'country', 'foo'), null, 'invalid property' );
    t.doesNotThrow( doc.addParent.bind(doc, 'country', '1'), null, 'invalid property' );
    t.end();
  });
};

module.exports.tests.removeParent = function(test) {
  test('removeParent', function(t) {
    var doc = new Document('mysource','mylayer','myid');
    doc.parent.country[0] = 'liberland';
    t.equal(doc.removeParent('country','liberland'), doc, 'chainable');
    t.equal(doc.parent.country.length, 0, 'remover works');
    t.end();
  });
  test('removeParent - validate', function(t) {
    var doc = new Document('mysource','mylayer','myid');
    t.throws( doc.removeParent.bind(doc, 1), null, 'invalid type' );
    t.throws( doc.removeParent.bind(doc, ''), null, 'invalid length' );
    t.throws( doc.removeParent.bind(doc, 'foo', 1), null, 'invalid property' );
    t.throws( doc.removeParent.bind(doc, '4', 2), null, 'invalid property' );
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
