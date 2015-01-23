
var Document = require('../../Document');

module.exports.tests = {};

module.exports.tests.getPolygon = function(test) {
  test('getPolygon', function(t) {
    var doc = new Document('mytype','myid');
    doc.boundaries = { 'foo': 'bar' };
    t.deepEqual(doc.getPolygon(), doc.boundaries, 'getter works');
    t.end();
  });
};

module.exports.tests.setPolygon = function(test) {
  test('setPolygon', function(t) {
    var doc = new Document('mytype','myid');
    t.equal(doc.boundaries, undefined, 'polygon undefined');
    t.equal(doc.setPolygon({ 'foo': 'bar' }), doc, 'chainable');
    t.deepEqual(doc.boundaries, { 'foo': 'bar' }, 'polygon set');
    t.end();
  });
  test('setPolygon - validate', function(t) {
    var doc = new Document('mytype','myid');
    t.throws( doc.setPolygon.bind(doc,undefined), null, 'invalid type' );
    t.throws( doc.setPolygon.bind(doc,''), null, 'invalid type' );
    t.throws( doc.setPolygon.bind(doc,1), null, 'invalid type' );
    t.throws( doc.setPolygon.bind(doc,[]), null, 'invalid type' );
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
