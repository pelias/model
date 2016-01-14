
var Document = require('../../Document');

module.exports.tests = {};

module.exports.tests.getSource = function(test) {
  test('getSource', function(t) {
    var doc = new Document('mysource','mylayer','myid');
    doc.source = 'test';
    t.equal(doc.getSource(), 'test', 'getter works');
    t.end();
  });
};

module.exports.tests.setSource = function(test) {
  test('setSource', function(t) {
    var doc = new Document('mysource','mylayer','myid');
    t.equal(doc.source, 'mysource', 'source set in constructor');
    t.equal(doc.setSource('test'), doc, 'chainable');
    t.equal(doc.source, 'test', 'source set');
    t.end();
  });
  test('setSource - validate', function(t) {
    var doc = new Document('mysource','mylayer','myid');
    t.throws( doc.setSource.bind(doc,1), null, 'invalid string' );
    t.throws( doc.setSource.bind(doc,''), null, 'invalid length' );
    t.end();
  });
  test('setSource - transform', function(t) {
    var doc = new Document('mysource','mylayer','myid');
    doc.setSource('TEST');
    t.equal(doc.source, 'test', 'accepts lowercase');
    t.end();
  });
};

module.exports.all = function (tape, common) {

  function test(name, testFunction) {
    return tape('source: ' + name, testFunction);
  }

  for( var testCase in module.exports.tests ){
    module.exports.tests[testCase](test, common);
  }
};
