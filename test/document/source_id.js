
var Document = require('../../Document');

module.exports.tests = {};

module.exports.tests.getSourceId = function(test) {
  test('getSourceId', function(t) {
    var doc = new Document('mysource','mylayer','myid');
    doc.source_id = 'test';
    t.equal(doc.getSourceId(), 'test', 'getter works');
    t.end();
  });
};

module.exports.tests.setSourceId = function(test) {
  test('setSourceId', function(t) {
    var doc = new Document('mysource','mylayer','myid');
    t.equal(doc.source_id, 'myid', 'source_id set in constructor');
    t.equal(doc.setSourceId('test'), doc, 'chainable');
    t.equal(doc.source_id, 'test', 'source_id set');
    t.end();
  });
  test('setSourceId - validate', function(t) {
    var doc = new Document('mysource','mylayer','myid');
    t.throws( doc.setSourceId.bind(doc,''), null, 'invalid length' );
    t.end();
  });
  test('setSourceId - transform', function(t) {
    var doc = new Document('mysource','mylayer','myid');
    doc.setSourceId('TEST');
    t.equal(doc.source_id, 'test', 'accepts lowercase');
    t.end();
  });
};

module.exports.all = function (tape, common) {

  function test(name, testFunction) {
    return tape('source_id: ' + name, testFunction);
  }

  for( var testCase in module.exports.tests ){
    module.exports.tests[testCase](test, common);
  }
};
