
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
  test('setAddress - validate key', function(t) {
    var doc = new Document('mysource','mylayer','myid');
    t.throws( doc.setAddress.bind(doc,1), null, 'invalid type' );
    t.throws( doc.setAddress.bind(doc,''), null, 'invalid length' );
    t.throws( doc.setAddress.bind(doc,' '), null, 'invalid length' );
    t.throws( doc.setAddress.bind(doc,null), null, 'invalid length' );
    t.equal(doc.getAddress('test'), undefined, 'property not set');
    t.end();
  });
  test('setAddress - validate key in property list', function(t) {
    var doc = new Document('mysource','mylayer','myid');
    t.throws( doc.setAddress.bind(doc, 'invalid', 'foo'), null, 'invalid property' );
    t.doesNotThrow( doc.setAddress.bind(doc, 'name', 'foo'), null, 'valid property' );
    t.doesNotThrow( doc.setAddress.bind(doc, 'number', 'foo'), null, 'valid property' );
    t.doesNotThrow( doc.setAddress.bind(doc, 'unit', 'foo'), null, 'valid property' );
    t.doesNotThrow( doc.setAddress.bind(doc, 'street', '1'), null, 'valid property' );
    t.doesNotThrow( doc.setAddress.bind(doc, 'zip', 'foo'), null, 'valid property' );
    t.end();
  });
  test('setAddress - validate val', function(t) {
    var doc = new Document('mysource','mylayer','myid');
    t.throws( doc.setAddress.bind(doc,'zip',1), null, 'invalid value' );
    t.throws( doc.setAddress.bind(doc,'zip',''), null, 'invalid value' );
    t.throws( doc.setAddress.bind(doc,'zip',' '), null, 'invalid value' );
    t.throws( doc.setAddress.bind(doc,'zip',null), null, 'invalid value' );
    t.throws( doc.setAddress.bind(doc,'zip','\t'), null, 'invalid value' );
    t.equal(doc.getAddress('test'), undefined, 'property not set');
    t.end();
  });
  test('setAddress - http regex', function (t) {
    var doc = new Document('mysource', 'mylayer', 'myid');
    t.throws(doc.setAddress.bind(doc, 'number', 'http://www.pelias.io'), /invalid regex/, 'regex failure');
    t.throws(doc.setAddress.bind(doc, 'number', 'AAhttp://www.pelias.ioBB'), /invalid regex/, 'regex failure');
    t.end();
  });
};

module.exports.tests.getAddressAliases = function(test) {
  test('getAddressAliases', function(t) {
    var doc = new Document('mysource','mylayer','myid');
    t.deepEqual(doc.getAddressAliases('zip'), [], 'getter works');
    doc.address_parts = { 'zip': 'bar' };
    t.deepEqual(doc.getAddressAliases('zip'), [], 'getter works');
    doc.address_parts = { 'zip': ['bar'] };
    t.deepEqual(doc.getAddressAliases('zip'), [], 'getter works');
    doc.address_parts = { 'zip': ['bar','baz','boo'] };
    t.deepEqual(doc.getAddressAliases('zip'), ['baz','boo'], 'getter works');
    t.end();
  });
};

module.exports.tests.setAddressAlias = function(test) {
  test('setAddressAlias - no prior call to setAddress', function(t) {
    var doc = new Document('mysource','mylayer','myid');
    t.equal(doc.setAddressAlias('zip','bar'), doc, 'chainable');
    t.equal(doc.setAddressAlias('zip','baz'), doc, 'chainable');
    t.equal(doc.address_parts.zip[0], 'bar', 'setter works');
    t.equal(doc.address_parts.zip[1], 'bar', 'setter works');
    t.equal(doc.address_parts.zip[2], 'baz', 'setter works');
    t.equal(doc.getAddress('zip'), 'bar', 'name set');
    t.deepEqual(doc.getAddressAliases('zip'), ['bar','baz'], 'aliases set');
    t.end();
  });
  test('setAddressAlias', function(t) {
    var doc = new Document('mysource','mylayer','myid');
    t.equal(doc.setAddress('zip','bar'), doc, 'chainable');
    t.equal(doc.setAddressAlias('zip','baz'), doc, 'chainable');
    t.equal(doc.setAddressAlias('zip','boo'), doc, 'chainable');
    t.equal(doc.address_parts.zip[0], 'bar', 'setter works');
    t.equal(doc.address_parts.zip[1], 'baz', 'setter works');
    t.equal(doc.address_parts.zip[2], 'boo', 'setter works');
    t.equal(doc.getAddress('zip'), 'bar', 'name set');
    t.deepEqual(doc.getAddressAliases('zip'), ['baz','boo'], 'aliases set');
    t.end();
  });
  test('setAddressAlias - validate key', function(t) {
    var doc = new Document('mysource','mylayer','myid');
    t.throws( doc.setAddressAlias.bind(doc,1), null, 'invalid type' );
    t.throws( doc.setAddressAlias.bind(doc,''), null, 'invalid length' );
    t.throws( doc.setAddressAlias.bind(doc,' '), null, 'invalid length' );
    t.throws( doc.setAddressAlias.bind(doc,null), null, 'invalid length' );
    t.deepEqual(doc.getAddressAliases('test'), [], 'property not set');
    t.end();
  });
  test('setAddressAlias - validate val', function(t) {
    var doc = new Document('mysource','mylayer','myid');
    t.throws( doc.setAddressAlias.bind(doc,'zip',1), null, 'invalid value' );
    t.throws( doc.setAddressAlias.bind(doc,'zip',''), null, 'invalid value' );
    t.throws( doc.setAddressAlias.bind(doc,'zip',' '), null, 'invalid value' );
    t.throws( doc.setAddressAlias.bind(doc,'zip',null), null, 'invalid value' );
    t.throws( doc.setAddressAlias.bind(doc,'zip','\t'), null, 'invalid value' );
    t.deepEqual(doc.getAddressAliases('test'), [], 'property not set');
    t.end();
  });
  test('setAddressAlias - http regex', function (t) {
    var doc = new Document('mysource', 'mylayer', 'myid');
    t.throws(doc.setAddressAlias.bind(doc, 'number', 'http://www.pelias.io'), /invalid regex/, 'regex failure');
    t.throws(doc.setAddressAlias.bind(doc, 'number', 'AAhttp://www.pelias.ioBB'), /invalid regex/, 'regex failure');
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

module.exports.tests.delAddress = function(test) {
  test('delAddress', function(t) {
    var doc = new Document('mysource','mylayer','myid');
    t.equal(doc.delAddress('zip'), false, 'deller works');
    doc.address_parts.zip = 'bar';
    t.equal(doc.delAddress('zip'), true, 'deller works');
    t.equal(doc.address_parts.zip, undefined, 'deller works');
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
