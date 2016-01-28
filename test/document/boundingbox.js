var Document = require('../../Document');

module.exports.tests = {};

module.exports.tests.setBoundingBox = function(test) {
  test('attempting to set boundingBox to a non-object should throw an exception', function(t) {
    var doc = new Document('mysource','mylayer','myid');

    t.throws(doc.setBoundingBox.bind(doc, 'this is not an object'),
      /invalid document type, expecting: object got: this is not an object/);
    t.equals(doc.getBoundingBox(), undefined);
    t.end();

  });

  test('boundingBox parameter without upperLeft should throw an exception', function(t) {
    var doc = new Document('mysource','mylayer','myid');

    var invalidBoundingBox = {
      lowerRight: {
        lat: 12.121212,
        lon: 31.313131
      }
    };

    t.throws(doc.setBoundingBox.bind(doc, invalidBoundingBox),
      /invalid boundingBox, non-object property 'upperLeft'/);
    t.equals(doc.getBoundingBox(), undefined);
    t.end();

  });

  test('boundingBox parameter with non-object upperLeft should throw an exception', function(t) {
    var doc = new Document('mysource','mylayer','myid');

    var invalidBoundingBox = {
      upperLeft: 'this is not an object',
      lowerRight: {
        lat: 12.121212,
        lon: 31.313131
      }
    };

    t.throws(doc.setBoundingBox.bind(doc, invalidBoundingBox),
      /invalid boundingBox, non-object property 'upperLeft'/);
    t.equals(doc.getBoundingBox(), undefined);
    t.end();

  });

  test('boundingBox parameter without upperLeft.lat should throw an exception', function(t) {
    var doc = new Document('mysource','mylayer','myid');

    var invalidBoundingBox = {
      upperLeft: {
        lon: 21.212121
      },
      lowerRight: {
        lat: 12.121212,
        lon: 31.313131
      }
    };

    t.throws(doc.setBoundingBox.bind(doc, invalidBoundingBox),
      /invalid boundingBox, property 'upperLeft\.lat' must be within range -90 to 90/);
    t.equals(doc.getBoundingBox(), undefined);
    t.end();

  });

  test('boundingBox parameter with non-number upperLeft.lat should throw an exception', function(t) {
    var doc = new Document('mysource','mylayer','myid');

    var invalidBoundingBox = {
      upperLeft: {
        lat: 'this is not a number',
        lon: 21.212121
      },
      lowerRight: {
        lat: 12.121212,
        lon: 31.313131
      }
    };

    t.throws(doc.setBoundingBox.bind(doc, invalidBoundingBox),
      /invalid boundingBox, property 'upperLeft\.lat' must be within range -90 to 90/);
    t.equals(doc.getBoundingBox(), undefined);
    t.end();

  });

  test('boundingBox parameter with NaN upperLeft.lat should throw an exception', function(t) {
    var doc = new Document('mysource','mylayer','myid');

    var invalidBoundingBox = {
      upperLeft: {
        lat: NaN,
        lon: 21.212121
      },
      lowerRight: {
        lat: 12.121212,
        lon: 31.313131
      }
    };

    t.throws(doc.setBoundingBox.bind(doc, invalidBoundingBox),
      /invalid boundingBox, property 'upperLeft\.lat' must be within range -90 to 90/);
    t.equals(doc.getBoundingBox(), undefined);
    t.end();

  });

  test('boundingBox parameter with upperLeft.lat < -90 should throw an exception', function(t) {
    var doc = new Document('mysource','mylayer','myid');

    var invalidBoundingBox = {
      upperLeft: {
        lat: -90.000001,
        lon: 21.212121
      },
      lowerRight: {
        lat: 12.121212,
        lon: 31.313131
      }
    };

    t.throws(doc.setBoundingBox.bind(doc, invalidBoundingBox),
      /invalid boundingBox, property 'upperLeft\.lat' must be within range -90 to 90/);
    t.equals(doc.getBoundingBox(), undefined);
    t.end();

  });

  test('boundingBox parameter with upperLeft.lat > 90 should throw an exception', function(t) {
    var doc = new Document('mysource','mylayer','myid');

    var invalidBoundingBox = {
      upperLeft: {
        lat: 90.000001,
        lon: 21.212121
      },
      lowerRight: {
        lat: 12.121212,
        lon: 31.313131
      }
    };

    t.throws(doc.setBoundingBox.bind(doc, invalidBoundingBox),
      /invalid boundingBox, property 'upperLeft\.lat' must be within range -90 to 90/);
    t.equals(doc.getBoundingBox(), undefined);
    t.end();

  });

  test('boundingBox parameter without upperLeft.lon should throw an exception', function(t) {
    var doc = new Document('mysource','mylayer','myid');

    var invalidBoundingBox = {
      upperLeft: {
        lat: 13.131313
      },
      lowerRight: {
        lat: 12.121212,
        lon: 31.313131
      }
    };

    t.throws(doc.setBoundingBox.bind(doc, invalidBoundingBox),
      /invalid boundingBox, property 'upperLeft\.lon' must be within range -180 to 180/);
    t.equals(doc.getBoundingBox(), undefined);
    t.end();

  });

  test('boundingBox parameter with non-number upperLeft.lon should throw an exception', function(t) {
    var doc = new Document('mysource','mylayer','myid');

    var invalidBoundingBox = {
      upperLeft: {
        lat: 13.131313,
        lon: 'this is not a number'
      },
      lowerRight: {
        lat: 12.121212,
        lon: 31.313131
      }
    };

    t.throws(doc.setBoundingBox.bind(doc, invalidBoundingBox),
      /invalid boundingBox, property 'upperLeft\.lon' must be within range -180 to 180/);
    t.equals(doc.getBoundingBox(), undefined);
    t.end();

  });

  test('boundingBox parameter with NaN upperLeft.lon should throw an exception', function(t) {
    var doc = new Document('mysource','mylayer','myid');

    var invalidBoundingBox = {
      upperLeft: {
        lat: 13.131313,
        lon: NaN
      },
      lowerRight: {
        lat: 12.121212,
        lon: 31.313131
      }
    };

    t.throws(doc.setBoundingBox.bind(doc, invalidBoundingBox),
      /invalid boundingBox, property 'upperLeft\.lon' must be within range -180 to 180/);
    t.equals(doc.getBoundingBox(), undefined);
    t.end();

  });

  test('boundingBox parameter with upperLeft.lon < -180 should throw an exception', function(t) {
    var doc = new Document('mysource','mylayer','myid');

    var invalidBoundingBox = {
      upperLeft: {
        lat: 13.131313,
        lon: -180.000001
      },
      lowerRight: {
        lat: 12.121212,
        lon: 31.313131
      }
    };

    t.throws(doc.setBoundingBox.bind(doc, invalidBoundingBox),
      /invalid boundingBox, property 'upperLeft\.lon' must be within range -180 to 180/);
    t.equals(doc.getBoundingBox(), undefined);
    t.end();

  });

  test('boundingBox parameter with upperLeft.lon > 180 should throw an exception', function(t) {
    var doc = new Document('mysource','mylayer','myid');

    var invalidBoundingBox = {
      upperLeft: {
        lat: 13.131313,
        lon: 180.000001
      },
      lowerRight: {
        lat: 12.121212,
        lon: 31.313131
      }
    };

    t.throws(doc.setBoundingBox.bind(doc, invalidBoundingBox),
      /invalid boundingBox, property 'upperLeft\.lon' must be within range -180 to 180/);
    t.equals(doc.getBoundingBox(), undefined);
    t.end();

  });

  test('boundingBox parameter without lowerRight should throw an exception', function(t) {
    var doc = new Document('mysource','mylayer','myid');

    var invalidBoundingBox = {
      upperLeft: {
        lat: 13.131313,
        lon: 21.212121
      }
    };

    t.throws(doc.setBoundingBox.bind(doc, invalidBoundingBox),
      /invalid boundingBox, non-object property 'lowerRight'/);
    t.equals(doc.getBoundingBox(), undefined);
    t.end();

  });

  test('boundingBox parameter with non-object lowerRight should throw an exception', function(t) {
    var doc = new Document('mysource','mylayer','myid');

    var invalidBoundingBox = {
      upperLeft: {
        lat: 13.131313,
        lon: 21.212121
      },
      lowerRight: 'this is not an object'
    };

    t.throws(doc.setBoundingBox.bind(doc, invalidBoundingBox),
      /invalid boundingBox, non-object property 'lowerRight'/);
    t.equals(doc.getBoundingBox(), undefined);
    t.end();

  });

  test('boundingBox parameter without lowerRight.lat should throw an exception', function(t) {
    var doc = new Document('mysource','mylayer','myid');

    var invalidBoundingBox = {
      upperLeft: {
        lat: 13.131313,
        lon: 21.212121
      },
      lowerRight: {
        lon: 31.313131
      }
    };

    t.throws(doc.setBoundingBox.bind(doc, invalidBoundingBox),
      /invalid boundingBox, property 'lowerRight\.lat' must be within range -90 to 90/);
    t.equals(doc.getBoundingBox(), undefined);
    t.end();

  });

  test('boundingBox parameter with non-number lowerRight.lat should throw an exception', function(t) {
    var doc = new Document('mysource','mylayer','myid');

    var invalidBoundingBox = {
      upperLeft: {
        lat: 13.131313,
        lon: 21.212121
      },
      lowerRight: {
        lat: 'this is not a number',
        lon: 31.313131
      }
    };

    t.throws(doc.setBoundingBox.bind(doc, invalidBoundingBox),
      /invalid boundingBox, property 'lowerRight\.lat' must be within range -90 to 90/);
    t.equals(doc.getBoundingBox(), undefined);
    t.end();

  });

  test('boundingBox parameter with NaN lowerRight.lat should throw an exception', function(t) {
    var doc = new Document('mysource','mylayer','myid');

    var invalidBoundingBox = {
      upperLeft: {
        lat: 13.131313,
        lon: 21.212121
      },
      lowerRight: {
        lat: NaN,
        lon: 31.313131
      }
    };

    t.throws(doc.setBoundingBox.bind(doc, invalidBoundingBox),
      /invalid boundingBox, property 'lowerRight\.lat' must be within range -90 to 90/);
    t.equals(doc.getBoundingBox(), undefined);
    t.end();

  });

  test('boundingBox parameter with lowerRight.lat < -90 should throw an exception', function(t) {
    var doc = new Document('mysource','mylayer','myid');

    var invalidBoundingBox = {
      upperLeft: {
        lat: 13.131313,
        lon: 21.212121
      },
      lowerRight: {
        lat: -90.000001,
        lon: 31.313131
      }
    };

    t.throws(doc.setBoundingBox.bind(doc, invalidBoundingBox),
      /invalid boundingBox, property 'lowerRight\.lat' must be within range -90 to 90/);
    t.equals(doc.getBoundingBox(), undefined);
    t.end();

  });

  test('boundingBox parameter with lowerRight.lat > 90 should throw an exception', function(t) {
    var doc = new Document('mysource','mylayer','myid');

    var invalidBoundingBox = {
      upperLeft: {
        lat: 13.131313,
        lon: 21.212121
      },
      lowerRight: {
        lat: 90.000001,
        lon: 31.313131
      }
    };

    t.throws(doc.setBoundingBox.bind(doc, invalidBoundingBox),
      /invalid boundingBox, property 'lowerRight\.lat' must be within range -90 to 90/);
    t.equals(doc.getBoundingBox(), undefined);
    t.end();

  });

  test('boundingBox parameter without lowerRight.lon should throw an exception', function(t) {
    var doc = new Document('mysource','mylayer','myid');

    var invalidBoundingBox = {
      upperLeft: {
        lat: 13.131313,
        lon: 21.212121
      },
      lowerRight: {
        lat: 12.121212
      }
    };

    t.throws(doc.setBoundingBox.bind(doc, invalidBoundingBox),
      /invalid boundingBox, property 'lowerRight\.lon' must be within range -180 to 180/);
    t.equals(doc.getBoundingBox(), undefined);
    t.end();

  });

  test('boundingBox parameter with non-number lowerRight.lon should throw an exception', function(t) {
    var doc = new Document('mysource','mylayer','myid');

    var invalidBoundingBox = {
      upperLeft: {
        lat: 13.131313,
        lon: 21.212121
      },
      lowerRight: {
        lat: 12.121212,
        lon: 'this is not a number'
      }
    };

    t.throws(doc.setBoundingBox.bind(doc, invalidBoundingBox),
      /invalid boundingBox, property 'lowerRight\.lon' must be within range -180 to 180/);
    t.equals(doc.getBoundingBox(), undefined);
    t.end();

  });

  test('boundingBox parameter with NaN lowerRight.lon should throw an exception', function(t) {
    var doc = new Document('mysource','mylayer','myid');

    var invalidBoundingBox = {
      upperLeft: {
        lat: 13.131313,
        lon: 21.212121
      },
      lowerRight: {
        lat: 12.121212,
        lon: NaN
      }
    };

    t.throws(doc.setBoundingBox.bind(doc, invalidBoundingBox),
      /invalid boundingBox, property 'lowerRight\.lon' must be within range -180 to 180/);
    t.equals(doc.getBoundingBox(), undefined);
    t.end();

  });

  test('boundingBox parameter with lowerRight.lon < -180 should throw an exception', function(t) {
    var doc = new Document('mysource','mylayer','myid');

    var invalidBoundingBox = {
      upperLeft: {
        lat: 13.131313,
        lon: 21.212121
      },
      lowerRight: {
        lat: 12.121212,
        lon: -180.000001
      }
    };

    t.throws(doc.setBoundingBox.bind(doc, invalidBoundingBox),
      /invalid boundingBox, property 'lowerRight\.lon' must be within range -180 to 180/);
    t.equals(doc.getBoundingBox(), undefined);
    t.end();

  });

  test('boundingBox parameter with lowerRight.lon > 180 should throw an exception', function(t) {
    var doc = new Document('mysource','mylayer','myid');

    var invalidBoundingBox = {
      upperLeft: {
        lat: 13.131313,
        lon: 21.212121
      },
      lowerRight: {
        lat: 12.121212,
        lon: 180.000001
      }
    };

    t.throws(doc.setBoundingBox.bind(doc, invalidBoundingBox),
      /invalid boundingBox, property 'lowerRight\.lon' must be within range -180 to 180/);
    t.equals(doc.getBoundingBox(), undefined);
    t.end();

  });

  test('upperLeft lat < lowerRight lat should throw an exception', function(t) {
    var doc = new Document('mysource','mylayer','myid');

    var invalidBoundingBox = {
      upperLeft: {
        lat: 12.121212,
        lon: 21.212121
      },
      lowerRight: {
        lat: 13.131313,
        lon: 31.313131
      }
    };

    t.throws(doc.setBoundingBox.bind(doc, invalidBoundingBox),
      /invalid boundingBox, upperLeft.lat must be >= lowerRight.lat/);
    t.equals(doc.getBoundingBox(), undefined);
    t.end();

  });

  test('upperLeft lon > lowerRight lon should throw an exception', function(t) {
    var doc = new Document('mysource','mylayer','myid');

    var invalidBoundingBox = {
      upperLeft: {
        lat: 13.131313,
        lon: 31.313131
      },
      lowerRight: {
        lat: 12.121212,
        lon: 21.212121
      }
    };

    t.throws(doc.setBoundingBox.bind(doc, invalidBoundingBox),
      /invalid boundingBox, upperLeft.lon must be <= lowerRight.lon/);
    t.equals(doc.getBoundingBox(), undefined);
    t.end();

  });

  test('lon values should wrap', function(t) {
    var doc = new Document('source', 'layer', 'id');

    var validBoundingBox = {
      upperLeft: {
        lat: 2.000000,
        lon: -179.000000
      },
      lowerRight: {
        lat: 1.000000,
        lon: 179.0000
      }
    };

    doc.setBoundingBox(validBoundingBox);

    t.deepEquals(JSON.parse(doc.getBoundingBox()), {
      min_lat: 1,
      max_lat: 2,
      min_lon: -179,
      max_lon: 179
    });
    t.end();

  });

  test('valid boundingBox parameter should be returned as input from getBoundingBox', function(t) {
    var doc = new Document('source', 'layer', 'id');

    var validBoundingBox = {
      upperLeft: {
        lat: 13.131313,
        lon: 21.212121
      },
      lowerRight: {
        lat: 12.121212,
        lon: 31.313131
      }
    };

    doc.setBoundingBox(validBoundingBox);

    t.deepEquals(JSON.parse(doc.getBoundingBox()), {
      min_lat: 12.121212,
      max_lat: 13.131313,
      min_lon: 21.212121,
      max_lon: 31.313131
    });
    t.end();

  });

  test('valid boundingBox parameter should be returned as input from getBoundingBox', function(t) {
    var doc = new Document('source', 'layer', 'id');

    var validBoundingBox = {
      upperLeft:{
        lat: 11.166667,
        lon: -3.260676
      },
      lowerRight:{
        lat: 4.735416889,
        lon: 1.19947914281
      }
    };

    doc.setBoundingBox(validBoundingBox);

    t.deepEquals(JSON.parse(doc.getBoundingBox()), {
      min_lat: 4.735416889,
      max_lat: 11.166667,
      min_lon: -3.260676,
      max_lon: 1.19947914281
    });
    t.end();

  });

};

module.exports.all = function (tape, common) {

  function test(name, testFunction) {
    return tape('boundingbox: ' + name, testFunction);
  }

  for( var testCase in module.exports.tests ){
    module.exports.tests[testCase](test, common);
  }
};
