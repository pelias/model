
var Document = require('../../Document');

module.exports.tests = {};

module.exports.tests.getParent = function(test) {
  test('getParent', function(t) {
    var doc = new Document('mysource','mylayer','myid');
    t.equal(doc.getParent('country'), undefined, 'getter works');
    doc.parent = { 'country': 'liberland' };
    t.equal(doc.getParent('country'), 'liberland', 'getter works');
    t.end();
  });
};

module.exports.tests.setParent = function(test) {
  test('setParent', function(t) {
    var doc = new Document('mysource','mylayer','myid');
    t.equal(doc.setParent('country','liberland'), doc, 'chainable');
    t.equal(doc.parent.country, 'liberland', 'setter works');
    t.end();
  });
  test('setParent - validate', function(t) {
    var doc = new Document('mysource','mylayer','myid');
    t.throws( doc.setParent.bind(doc, 1), null, 'invalid type' );
    t.throws( doc.setParent.bind(doc, ''), null, 'invalid length' );
    t.throws( doc.setParent.bind(doc, 'foo', 1), null, 'invalid property' );
    t.throws( doc.setParent.bind(doc, '4', 2), null, 'invalid property' );
    t.throws( doc.setParent.bind(doc, 'country', 2), null, 'invalid property' );
    t.throws( doc.setParent.bind(doc, 'country', true), null, 'invalid property' );
    t.throws( doc.setParent.bind(doc, 'country', null), null, 'invalid property' );
    t.throws( doc.setParent.bind(doc, 'country', '\n'), null, 'invalid property' );
    t.equal(doc.parent.street, undefined, 'property unchanged');
    t.doesNotThrow( doc.setParent.bind(doc, 'country', 'foo'), null, 'invalid property' );
    t.doesNotThrow( doc.setParent.bind(doc, 'country', '1'), null, 'invalid property' );
    t.end();
  });
};

module.exports.tests.hasParent = function(test) {
  test('hasParent', function(t) {
    var doc = new Document('mysource','mylayer','myid');
    t.equal(doc.hasParent('country'), false, 'hasser works');
    doc.parent.country = 'liberland';
    t.equal(doc.hasParent('country'), true, 'hasser works');
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
