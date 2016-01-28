
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
    t.end();
  });
  test('setName - validate key', function(t) {
    var doc = new Document('mysource','mylayer','myid');
    t.throws( doc.setName.bind(doc,1), null, 'invalid type' );
    t.throws( doc.setName.bind(doc,''), null, 'invalid length' );
    t.throws( doc.setName.bind(doc,' '), null, 'invalid length' );
    t.throws( doc.setName.bind(doc,null), null, 'invalid length' );
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
