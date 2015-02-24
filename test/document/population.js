
var Document = require('../../Document');

module.exports.tests = {};

module.exports.tests.getPopulation = function(test) {
  test('getPopulation', function(t) {
    var doc = new Document('mytype','myid');
    doc.population = 10000;
    t.equal(doc.getPopulation(), 10000, 'getter works');
    t.end();
  });
};

module.exports.tests.setPopulation = function(test) {
  test('setPopulation', function(t) {
    var doc = new Document('mytype','myid');
    t.equal(doc.population, undefined, 'Population undefined');
    t.equal(doc.setPopulation(1000), doc, 'chainable');
    t.equal(doc.population, 1000, 'Population set');
    t.end();
  });
  test('setPopulation - validate', function(t) {
    var doc = new Document('mytype','myid');
    t.throws( doc.setPopulation.bind(doc,-1), null, 'invalid: negative value' );
    t.throws( doc.setPopulation.bind(doc,undefined), null, 'invalid length' );
    t.throws( doc.setPopulation.bind(doc,'XX'), null, 'invalid format' );
    t.throws( doc.setPopulation.bind(doc,NaN), null, 'invalid: float value' );
    t.end();
  });
};

module.exports.all = function (tape, common) {

  function test(name, testFunction) {
    return tape('Population: ' + name, testFunction);
  }

  for( var testCase in module.exports.tests ){
    module.exports.tests[testCase](test, common);
  }
};
