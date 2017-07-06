var transform = require('../../util/transform.js');

module.exports.tests = {};

module.exports.tests.uppercase = function(test) {
  test('uppercase: valid', function(t) {
    t.equals( transform.uppercase('TesTinG 123'), 'TESTING 123' );
    t.end();
  });
  test('uppercase: invalid', function(t) {
    t.throws( function(){ transform.uppercase([]); });
    t.throws( function(){ transform.uppercase({}); });
    t.throws( function(){ transform.uppercase(null); });
    t.throws( function(){ transform.uppercase(undefined); });
    t.end();
  });
};

module.exports.tests.lowercase = function(test) {
  test('lowercase: valid', function(t) {
    t.equals( transform.lowercase('TesTinG 123'), 'testing 123' );
    t.end();
  });
  test('lowercase: invalid', function(t) {
    t.throws( function(){ transform.lowercase([]); });
    t.throws( function(){ transform.lowercase({}); });
    t.throws( function(){ transform.lowercase(null); });
    t.throws( function(){ transform.lowercase(undefined); });
    t.end();
  });
};

module.exports.tests.stringify = function(test) {
  test('stringify: valid', function(t) {
    t.equals( transform.stringify('TesTinG 123'), 'TesTinG 123' );
    t.equals( transform.stringify(123), '123' );
    t.equals( transform.stringify(123.456), '123.456' );
    t.equals( transform.stringify([]), '' );
    t.equals( transform.stringify({}), '' );
    t.equals( transform.stringify(null), '' );
    t.equals( transform.stringify(undefined), '' );
    t.end();
  });
};

module.exports.tests.floatify = function(test) {
  test('floatify: valid', function(t) {
    t.equals( transform.floatify(null, '123.3456789'), 123 );
    t.equals( transform.floatify(null, 123.3456789), 123 );
    t.equals( transform.floatify(undefined, '123.3456789'), 123 );
    t.equals( transform.floatify(undefined, 123.3456789), 123 );
    t.equals( transform.floatify('4', '123.3456789'), 123.3456 );
    t.equals( transform.floatify('4', 123.3456789), 123.3456 );
    t.equals( transform.floatify(4, '123.3456789'), 123.3456 );
    t.equals( transform.floatify(4, 123.3456789), 123.3456 );
    t.true( isNaN( transform.floatify(4, 'TesTinG 123') ) );
    t.end();
  });
};

module.exports.tests.roundify = function(test) {
  test('roundify: valid', function(t) {
    t.equals( transform.roundify('123'), 123 );
    t.equals( transform.roundify('123.3456789'), 123 );
    t.equals( transform.roundify(123), 123 );
    t.equals( transform.roundify(123.345), 123 );
    t.true( isNaN( transform.roundify('TesTinG 123') ) );
    t.end();
  });
};

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

    t.deepEquals(JSON.parse(transform.toULLR(inputBoundingBox)), expected);
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
