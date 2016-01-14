var boundingBoxify = require('../../util/transform.js').boundingBoxify();

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

    var expectedBoundingBox = {
      type: 'envelope',
      coordinates: [
        [21.212121, 13.131313],
        [31.313131, 12.121212]
      ]
    };

    t.deepEquals(boundingBoxify(inputBoundingBox), expectedBoundingBox);
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
