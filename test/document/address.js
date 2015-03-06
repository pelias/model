
var Document = require('../../Document');

module.exports.tests = {};

module.exports.tests.getAddress = function(test) {
  test('getAddress', function(t) {
    var doc = new Document('mytype','myid');
    t.equal(doc.getAddress('foo'), undefined, 'getter works');
    doc.address = { 'foo': 'bar' };
    t.equal(doc.getAddress('foo'), 'bar', 'getter works');
    t.end();
  });
};

module.exports.tests.setAddress = function(test) {
  test('setAddress', function(t) {
    var doc = new Document('mytype','myid');
    t.equal(doc.setAddress('foo','bar'), doc, 'chainable');
    t.equal(doc.address.foo, 'bar', 'setter works');
    t.end();
  });
  test('setAddress - validate', function(t) {
    var doc = new Document('mytype','myid');
    t.throws( doc.setAddress.bind(doc,1), null, 'invalid type' );
    t.throws( doc.setAddress.bind(doc,''), null, 'invalid length' );
    t.end();
  });
};

module.exports.tests.hasAddress = function(test) {
  test('hasAddress', function(t) {
    var doc = new Document('mytype','myid');
    t.equal(doc.hasAddress('foo'), false, 'hasser works');
    doc.address.foo = 'bar';
    t.equal(doc.hasAddress('foo'), true, 'hasser works');
    t.end();
  });
};

module.exports.tests.delAddress = function(test) {
  test('delAddress', function(t) {
    var doc = new Document('mytype','myid');
    t.equal(doc.delAddress('foo'), false, 'deller works');
    doc.address.foo = 'bar';
    t.equal(doc.delAddress('foo'), true, 'deller works');
    t.equal(doc.address.foo, undefined, 'deller works');
    t.end();
  });
};

module.exports.all = function (tape, common) {

  function test(name, testFunction) {
    return tape('address: ' + name, testFunction);
  }

  for( var testCase in module.exports.tests ){
    module.exports.tests[testCase](test, common);
  }
};
