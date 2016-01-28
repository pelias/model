
var Document = require('../../Document');

module.exports.tests = {};

module.exports.tests.getPopularity = function(test) {
  test('getPopularity', function(t) {
    var doc = new Document('mysource','mylayer','myid');
    doc.popularity = 10000;
    t.equal(doc.getPopularity(), 10000, 'getter works');
    t.end();
  });
};

module.exports.tests.setPopularity = function(test) {
  test('setPopularity', function(t) {
    var doc = new Document('mysource','mylayer','myid');
    t.equal(doc.popularity, undefined, 'popularity undefined');
    t.equal(doc.setPopularity(1000), doc, 'chainable');
    t.equal(doc.popularity, 1000, 'popularity set');
    t.end();
  });
  test('setPopularity - validate', function(t) {
    var doc = new Document('mysource','mylayer','myid');
    t.throws( doc.setPopularity.bind(doc,-1), null, 'invalid: negative value' );
    t.throws( doc.setPopularity.bind(doc,undefined), null, 'invalid length' );
    t.throws( doc.setPopularity.bind(doc,'XX'), null, 'invalid format' );
    t.throws( doc.setPopularity.bind(doc,NaN), null, 'invalid: float value' );
    t.end();
  });
  test('setPopularity - transform', function(t) {
    var doc = new Document('mysource','mylayer','myid');
    doc.setPopularity(12.3);
    t.equal(doc.popularity, 12, 'transforms: rounding the odd float value (floor)');
    doc.setPopularity(12.7);
    t.equal(doc.popularity, 13, 'transforms: rounding the odd float value (ceil)');
    doc.setPopularity(12.49999);
    t.equal(doc.popularity, 12, 'transforms: rounding the odd float value (floor)');
    doc.setPopularity('');
    t.equal(doc.popularity, 0, 'transforms: returns 0 incase of empty string');
    t.end();
  });
  test('setPopularity - accept zero value', function(t) {
    var doc = new Document('mysource','mylayer','myid');
    doc.setPopularity(0);
    t.equal(doc.popularity, 0, 'allow zero popularity');
    t.end();
  });
};

module.exports.all = function (tape, common) {

  function test(name, testFunction) {
    return tape('popularity: ' + name, testFunction);
  }

  for( var testCase in module.exports.tests ){
    module.exports.tests[testCase](test, common);
  }
};
