
var Centroid = require('../Centroid');

module.exports.tests = {};

module.exports.tests.interface = function(test, common) {
  test('valid interface', function(t) {
    t.equal(typeof Centroid, 'function', 'Centroid is a function');

    t.equal(typeof Centroid.prototype.getLat, 'function', 'getLat() is a function');
    t.equal(typeof Centroid.prototype.setLat, 'function', 'setLat() is a function');

    t.equal(typeof Centroid.prototype.getLon, 'function', 'getLon() is a function');
    t.equal(typeof Centroid.prototype.setLon, 'function', 'setLon() is a function');

    t.end();
  });
};

module.exports.all = function (tape, common) {

  function test(name, testFunction) {
    return tape('Centroid: ' + name, testFunction);
  }

  for( var testCase in module.exports.tests ){
    module.exports.tests[testCase](test, common);
  }
};