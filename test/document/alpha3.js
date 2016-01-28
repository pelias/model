
var Document = require('../../Document');

module.exports.tests = {};

module.exports.tests.getAlpha3 = function(test) {
  test('getAlpha3', function(t) {
    var doc = new Document('mysource','mylayer','myid');
    doc.alpha3 = 'GBR';
    t.equal(doc.getAlpha3(), 'GBR', 'getter works');
    t.end();
  });
};

module.exports.tests.setAlpha3 = function(test) {
  test('setAlpha3', function(t) {
    var doc = new Document('mysource','mylayer','myid');
    t.equal(doc.alpha3, undefined, 'alpha3 undefined');
    t.equal(doc.setAlpha3('FOO'), doc, 'chainable');
    t.equal(doc.alpha3, 'FOO', 'alpha3 set');
    t.end();
  });
  test('setAlpha3 - validate', function(t) {
    var doc = new Document('mysource','mylayer','myid');
    t.throws( doc.setAlpha3.bind(doc,1), null, 'invalid alpha3' );
    t.throws( doc.setAlpha3.bind(doc,''), null, 'invalid length' );
    t.throws( doc.setAlpha3.bind(doc,'GB'), null, 'invalid length' );
    t.throws( doc.setAlpha3.bind(doc,'GBRX'), null, 'invalid length' );
    t.end();
  });
  test('setAlpha3 - transform', function(t) {
    var doc = new Document('mysource','mylayer','myid');
    doc.setAlpha3('foo');
    t.equal(doc.alpha3, 'FOO', 'accepts lowercase');
    t.end();
  });
};

module.exports.all = function (tape, common) {

  function test(name, testFunction) {
    return tape('alpha3: ' + name, testFunction);
  }

  for( var testCase in module.exports.tests ){
    module.exports.tests[testCase](test, common);
  }
};
