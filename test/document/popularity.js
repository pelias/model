
var Document = require('../../Document');

module.exports.tests = {};

module.exports.tests.getPopularity = function(test) {
  test('getPopularity', function(t) {
    var doc = new Document('mytype','myid');
    doc.popularity = 10000;
    t.equal(doc.getPopularity(), 10000, 'getter works');
    t.end();
  });
};

module.exports.tests.setPopularity = function(test) {
  test('setPopularity', function(t) {
    var doc = new Document('mytype','myid');
    t.equal(doc.popularity, undefined, 'popularity undefined');
    t.equal(doc.setPopularity(1000), doc, 'chainable');
    t.equal(doc.popularity, 1000, 'popularity set');
    t.end();
  });
  test('setPopularity - validate', function(t) {
    var doc = new Document('mytype','myid');
    t.throws( doc.setPopularity.bind(doc,-1), null, 'invalid: negative value' );
    t.throws( doc.setPopularity.bind(doc,''), null, 'invalid length' );
    t.throws( doc.setPopularity.bind(doc,'XX'), null, 'invalid format' );
    t.throws( doc.setPopularity.bind(doc,'12.3'), null, 'invalid: float value' );
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
