var toULLR = require('../../util/transform.js').toULLR();

module.exports.tests = {};

module.exports.tests.setBoundingBox = function(test) {
  test('valid boundingBox parameter should be returned as input from getBoundingBox', function(t) {
    var inputBoundingBox = {
      upperLeft: {
        lat: 13.131313,
        lon: 21.212121
      },
      lowerRight: {
        lat: 12.121212,
        lon: 31.313131
      }
    };

    var expected = {
      min_lat: 12.121212,
      max_lat: 13.131313,
      min_lon: 21.212121,
      max_lon: 31.313131
    };

    t.deepEquals(JSON.parse(toULLR(inputBoundingBox)), expected);
    t.end();

  });

};

module.exports.all = function (tape, common) {

  function test(name, testFunction) {
    return tape('boundingBoxify: ' + name, testFunction);
  }

  for( var testCase in module.exports.tests ){
    module.exports.tests[testCase](test, common);
  }
};
