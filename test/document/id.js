
var Document = require('../../Document');

module.exports.tests = {};

module.exports.tests.getId = function(test) {
  test('getId', function(t) {
    var doc = new Document('mysource','mylayer','myid');
    doc._meta.id = 'foo';
    t.equal(doc.getId(), 'foo', 'getter works');
    t.end();
  });
};

module.exports.tests.setId = function(test) {
  test('setId', function(t) {
    var doc = new Document('mysource','mylayer','myid');
    t.equal(doc._meta.id, 'myid', 'id set in constructor');
    t.equal(doc.setId('foo'), doc, 'chainable');
    t.equal(doc._meta.id, 'foo', 'id set');
    t.end();
  });
  test('setId - validate id type', function(t) {
    var doc = new Document('mysource','mylayer','myid');
    t.throws( function(){
      doc.setId( undefined );
    });
    t.end();
  });
  test('setId - validate id length', function(t) {
    var doc = new Document('mysource','mylayer','myid');
    t.throws( function(){
      doc.setId( '' );
    });
    t.end();
  });
  test('setId - validate not empty', function(t) {
    var doc = new Document('mysource','mylayer','myid');
    t.throws( function(){
      doc.setId( ' ' );
    });
    t.end();
  });
  test('setId - transform', function(t) {
    var doc = new Document('mysource','mylayer','myid');
    doc.setId(100);
    t.equal(doc._meta.id, '100', 'accepts numbers');
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
