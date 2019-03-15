
var Document = require('../../Document');

module.exports.tests = {};

module.exports.tests.getName = function(test) {
  test('getName', function(t) {
    var doc = new Document('mysource','mylayer','myid');
    t.equal(doc.getName('foo'), undefined, 'getter works');
    doc.name = { 'foo': 'bar' };
    t.equal(doc.getName('foo'), 'bar', 'getter works');
    t.end();
  });
};

module.exports.tests.setName = function(test) {
  test('setName', function(t) {
    var doc = new Document('mysource','mylayer','myid');
    t.equal(doc.setName('foo','bar'), doc, 'chainable');
    t.equal(doc.name.foo, 'bar', 'setter works');
    t.equal(doc.phrase.foo, 'bar', 'setter works');
    t.end();
  });
  test('setName - validate key', function(t) {
    var doc = new Document('mysource','mylayer','myid');
    t.throws( doc.setName.bind(doc,1), null, 'invalid type' );
    t.throws( doc.setName.bind(doc,''), null, 'invalid length' );
    t.throws( doc.setName.bind(doc,' '), null, 'invalid length' );
    t.throws( doc.setName.bind(doc,null), null, 'invalid length' );
    t.equal(doc.getName('test'), undefined, 'property not set');
    t.end();
  });
  test('setName - validate val', function(t) {
    var doc = new Document('mysource','mylayer','myid');
    t.throws( doc.setName.bind(doc,'test',1), null, 'invalid value' );
    t.throws( doc.setName.bind(doc,'test',''), null, 'invalid value' );
    t.throws( doc.setName.bind(doc,'test',' '), null, 'invalid value' );
    t.throws( doc.setName.bind(doc,'test',null), null, 'invalid value' );
    t.throws( doc.setName.bind(doc,'test','\t'), null, 'invalid value' );
    t.equal(doc.getName('test'), undefined, 'property not set');
    t.end();
  });
  test('setName - http regex', function (t) {
    var doc = new Document('mysource', 'mylayer', 'myid');
    t.throws(doc.setName.bind(doc, 'default', 'http://www.pelias.io'), /invalid regex/, 'regex failure');
    t.throws(doc.setName.bind(doc, 'default', 'AAhttp://www.pelias.ioBB'), /invalid regex/, 'regex failure');
    t.end();
  });
};

module.exports.tests.getNameAliases = function(test) {
  test('getNameAliases', function(t) {
    var doc = new Document('mysource','mylayer','myid');
    t.deepEqual(doc.getNameAliases('foo'), [], 'getter works');
    doc.name = { 'foo': 'bar' };
    t.deepEqual(doc.getNameAliases('foo'), [], 'getter works');
    doc.name = { 'foo': ['bar'] };
    t.deepEqual(doc.getNameAliases('foo'), [], 'getter works');
    doc.name = { 'foo': ['bar','baz','boo'] };
    t.deepEqual(doc.getNameAliases('foo'), ['baz','boo'], 'getter works');
    t.end();
  });
};

module.exports.tests.setNameAlias = function(test) {
  test('setNameAlias - no prior call to setName', function(t) {
    var doc = new Document('mysource','mylayer','myid');
    t.equal(doc.setNameAlias('foo','bar'), doc, 'chainable');
    t.equal(doc.setNameAlias('foo','baz'), doc, 'chainable');
    t.equal(doc.name.foo[0], 'bar', 'setter works');
    t.equal(doc.name.foo[1], 'bar', 'setter works');
    t.equal(doc.name.foo[2], 'baz', 'setter works');
    t.equal(doc.phrase.foo[0], 'bar', 'setter works');
    t.equal(doc.phrase.foo[1], 'bar', 'setter works');
    t.equal(doc.phrase.foo[2], 'baz', 'setter works');
    t.equal(doc.getName('foo'), 'bar', 'name set');
    t.deepEqual(doc.getNameAliases('foo'), ['bar','baz'], 'aliases set');
    t.end();
  });
  test('setNameAlias', function(t) {
    var doc = new Document('mysource','mylayer','myid');
    t.equal(doc.setName('foo','bar'), doc, 'chainable');
    t.equal(doc.setNameAlias('foo','baz'), doc, 'chainable');
    t.equal(doc.setNameAlias('foo','boo'), doc, 'chainable');
    t.equal(doc.name.foo[0], 'bar', 'setter works');
    t.equal(doc.name.foo[1], 'baz', 'setter works');
    t.equal(doc.name.foo[2], 'boo', 'setter works');
    t.equal(doc.phrase.foo[0], 'bar', 'setter works');
    t.equal(doc.phrase.foo[1], 'baz', 'setter works');
    t.equal(doc.phrase.foo[2], 'boo', 'setter works');
    t.equal(doc.getName('foo'), 'bar', 'name set');
    t.deepEqual(doc.getNameAliases('foo'), ['baz','boo'], 'aliases set');
    t.end();
  });
  test('setNameAlias - validate key', function(t) {
    var doc = new Document('mysource','mylayer','myid');
    t.throws( doc.setNameAlias.bind(doc,1), null, 'invalid type' );
    t.throws( doc.setNameAlias.bind(doc,''), null, 'invalid length' );
    t.throws( doc.setNameAlias.bind(doc,' '), null, 'invalid length' );
    t.throws( doc.setNameAlias.bind(doc,null), null, 'invalid length' );
    t.deepEqual(doc.getNameAliases('test'), [], 'property not set');
    t.end();
  });
  test('setNameAlias - validate val', function(t) {
    var doc = new Document('mysource','mylayer','myid');
    t.throws( doc.setNameAlias.bind(doc,'test',1), null, 'invalid value' );
    t.throws( doc.setNameAlias.bind(doc,'test',''), null, 'invalid value' );
    t.throws( doc.setNameAlias.bind(doc,'test',' '), null, 'invalid value' );
    t.throws( doc.setNameAlias.bind(doc,'test',null), null, 'invalid value' );
    t.throws( doc.setNameAlias.bind(doc,'test','\t'), null, 'invalid value' );
    t.deepEqual(doc.getNameAliases('test'), [], 'property not set');
    t.end();
  });
  test('setNameAlias - http regex', function (t) {
    var doc = new Document('mysource', 'mylayer', 'myid');
    t.throws(doc.setNameAlias.bind(doc, 'default', 'http://www.pelias.io'), /invalid regex/, 'regex failure');
    t.throws(doc.setNameAlias.bind(doc, 'default', 'AAhttp://www.pelias.ioBB'), /invalid regex/, 'regex failure');
    t.end();
  });
};

module.exports.tests.hasName = function(test) {
  test('hasName', function(t) {
    var doc = new Document('mysource','mylayer','myid');
    t.equal(doc.hasName('foo'), false, 'hasser works');
    doc.name.foo = 'bar';
    t.equal(doc.hasName('foo'), true, 'hasser works');
    t.end();
  });
};

module.exports.tests.delName = function(test) {
  test('delName', function(t) {
    var doc = new Document('mysource','mylayer','myid');
    t.equal(doc.delName('foo'), false, 'deller works');
    doc.name.foo = 'bar';
    t.equal(doc.delName('foo'), true, 'deller works');
    t.equal(doc.name.foo, undefined, 'deller works');
    t.end();
  });
};

module.exports.all = function (tape, common) {

  function test(name, testFunction) {
    return tape('name: ' + name, testFunction);
  }

  for( var testCase in module.exports.tests ){
    module.exports.tests[testCase](test, common);
  }
};
