
var Document = require('../../Document');

module.exports.tests = {};

module.exports.tests.getAddress = function(test) {
  test('getAddress', function(t) {
    var doc = new Document('mysource','mylayer','myid');
    t.equal(doc.getAddress('zip'), undefined, 'getter works');
    doc.address_parts = { 'zip': 'bar' };
    t.equal(doc.getAddress('zip'), 'bar', 'getter works');
    t.end();
  });
};

module.exports.tests.setAddress = function(test) {
  test('setAddress', function(t) {
    var doc = new Document('mysource','mylayer','myid');
    t.equal(doc.setAddress('zip','bar'), doc, 'chainable');
    t.equal(doc.address_parts.zip, 'bar', 'setter works');
    t.end();
  });
  test('setAddress - validate', function(t) {
    var doc = new Document('mysource','mylayer','myid');
    t.throws( doc.setAddress.bind(doc, 1), null, 'invalid type' );
    t.throws( doc.setAddress.bind(doc, ''), null, 'invalid length' );
    t.throws( doc.setAddress.bind(doc, 'foo', 1), null, 'invalid property' );
    t.throws( doc.setAddress.bind(doc, '4', 2), null, 'invalid property' );
    t.throws( doc.setAddress.bind(doc, 'zip', 2), null, 'invalid property' );
    t.throws( doc.setAddress.bind(doc, 'street', true), null, 'invalid property' );
    t.throws( doc.setAddress.bind(doc, 'street', null), null, 'invalid property' );
    t.throws( doc.setAddress.bind(doc, 'street', '\n'), null, 'invalid property' );
    t.equal(doc.address_parts.street, undefined, 'property unchanged');
    t.doesNotThrow( doc.setAddress.bind(doc, 'zip', 'foo'), null, 'invalid property' );
    t.doesNotThrow( doc.setAddress.bind(doc, 'street', '1'), null, 'invalid property' );
    t.end();
  });
};

module.exports.tests.hasAddress = function(test) {
  test('hasAddress', function(t) {
    var doc = new Document('mysource','mylayer','myid');
    t.equal(doc.hasAddress('zip'), false, 'hasser works');
    doc.address_parts.zip = 'bar';
    t.equal(doc.hasAddress('zip'), true, 'hasser works');
    t.end();
  });
};

module.exports.all = function (tape, common) {

  function test(name, testFunction) {
    return tape('address_parts: ' + name, testFunction);
  }

  for( var testCase in module.exports.tests ){
    module.exports.tests[testCase](test, common);
  }
};
