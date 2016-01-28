
var Document = require('../../Document');

module.exports.tests = {};

module.exports.tests.getLayer = function(test) {
  test('getLayer', function(t) {
    var doc = new Document('mysource','mylayer','myid');
    doc.layer = 'test';
    t.equal(doc.getLayer(), 'test', 'getter works');
    t.end();
  });
};

module.exports.tests.setLayer = function(test) {
  test('setLayer', function(t) {
    var doc = new Document('mysource','mylayer','myid');
    t.equal(doc.layer, 'mylayer', 'layer set in constructor');
    t.equal(doc.setLayer('test'), doc, 'chainable');
    t.equal(doc.layer, 'test', 'layer set');
    t.end();
  });
  test('setLayer - validate', function(t) {
    var doc = new Document('mysource','mylayer','myid');
    t.throws( doc.setLayer.bind(doc,1), null, 'invalid string' );
    t.throws( doc.setLayer.bind(doc,''), null, 'invalid length' );
    t.end();
  });
  test('setLayer - transform', function(t) {
    var doc = new Document('mysource','mylayer','myid');
    doc.setLayer('TEST');
    t.equal(doc.layer, 'test', 'accepts lowercase');
    t.end();
  });
};

module.exports.all = function (tape, common) {

  function test(name, testFunction) {
    return tape('layer: ' + name, testFunction);
  }

  for( var testCase in module.exports.tests ){
    module.exports.tests[testCase](test, common);
  }
};
