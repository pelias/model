
var Document = require('../Document');

module.exports.tests = {};

module.exports.tests.getId = function(test, common) {
  test('getId', function(t) {
    var doc = new Document('mytype','myid');
    doc.id = 'foo';
    t.equal(doc.getId(), 'foo', 'getter works');
    t.end();
  });
};

module.exports.tests.setId = function(test, common) {
  test('setId', function(t) {
    var doc = new Document('mytype','myid');
    t.equal(doc.id, 'myid', 'id set in constructor');
    t.equal(doc.setId('foo'), doc, 'chainable');
    t.equal(doc.id, 'foo', 'id set');
    t.end();
  });
  test('setId - validate', function(t) {
    var doc = new Document('mytype','myid');
    t.throws( doc.setId.bind(doc,undefined), null, 'invalid type' );
    t.throws( doc.setId.bind(doc,''), null, 'invalid length' );
    t.end();
  });
  test('setId - transform', function(t) {
    var doc = new Document('mytype','myid');
    doc.setId(100);
    t.equal(doc.id, '100', 'accepts numbers');
    t.end();
  });
};

module.exports.all = function (tape, common) {

  function test(name, testFunction) {
    return tape('id: ' + name, testFunction);
  }

  for( var testCase in module.exports.tests ){
    module.exports.tests[testCase](test, common);
  }
};