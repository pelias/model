
var Document = require('../../Document');

module.exports.tests = {};

module.exports.tests.getShape = function(test) {
  test('getShape', function(t) {
    var doc = new Document('mysource','mylayer','myid');
    doc.shape = { 'foo': 'bar' };
    t.deepEqual(doc.getShape(), doc.shape, 'getter works');
    t.end();
  });
};

module.exports.tests.setShape = function(test) {
  test('setShape', function(t) {
    var doc = new Document('mysource','mylayer','myid');
    t.equal(doc.shape, undefined, 'polygon undefined');
    t.equal(doc.setShape({ 'foo': 'bar' }), doc, 'chainable');
    t.deepEqual(doc.shape, { 'foo': 'bar' }, 'polygon set');
    t.end();
  });
  test('setShape - validate', function(t) {
    var doc = new Document('mysource','mylayer','myid');
    t.throws( doc.setShape.bind(doc,undefined), null, 'invalid type' );
    t.throws( doc.setShape.bind(doc,''), null, 'invalid type' );
    t.throws( doc.setShape.bind(doc,1), null, 'invalid type' );
    t.throws( doc.setShape.bind(doc,[]), null, 'invalid type' );
    t.end();
  });
};

module.exports.all = function (tape, common) {

  function test(name, testFunction) {
    return tape('polygon: ' + name, testFunction);
  }

  for( var testCase in module.exports.tests ){
    module.exports.tests[testCase](test, common);
  }
};
