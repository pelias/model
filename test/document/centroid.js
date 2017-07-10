
var Document = require('../../Document');

module.exports.tests = {};

module.exports.tests.getCentroid = function(test) {
  test('getCentroid', function(t) {
    var doc = new Document('mysource','mylayer','myid');
    t.deepEqual(doc.getCentroid(), {}, 'getter works');
    doc.center_point = { lat: 1, lon: 2 };
    t.equal(doc.getCentroid(), doc.center_point, 'getter works');
    t.end();
  });
};

module.exports.tests.setCentroid = function(test) {
  test('setCentroid', function(t) {
    var doc = new Document('mysource','mylayer','myid');

    t.equal(doc.setCentroid({ lon: 1, lat: 2 }), doc, 'chainable');
    t.deepEqual(doc.center_point, { lat: 2, lon: 1 }, 'setter works');
    t.equal(doc.setCentroid({lon:'1.1',lat:'1.2'}), doc, 'chainable');
    t.deepEqual(doc.center_point, { lat: 1.2, lon: 1.1 }, 'setter works');
    t.end();

  });

  test('setCentroid - validate', function(t) {
    var doc = new Document('mysource','mylayer','myid');
    t.throws( doc.setCentroid.bind(doc), null, 'invalid args' );
    t.throws( doc.setCentroid.bind(doc,1), null, 'invalid args' );
    t.throws( doc.setCentroid.bind(doc,'one','two'), null, 'invalid types' );
    t.throws( doc.setCentroid.bind(doc,{ lon: 1 }), null, 'missing lat' );
    t.throws( doc.setCentroid.bind(doc,{ lat: 1 }), null, 'missing lon' );
    t.throws( doc.setCentroid.bind(doc,{}), null, 'missing lat/lon' );
    t.end();
  });

  test('string lat and lon properties in parameters should be transformed and fixed precision', (t) => {
    const doc = new Document('mysource','mylayer','myid');

    doc.setCentroid({ lat: '12.3456789', lon: '-12.3456789'});

    t.deepEquals(doc.getCentroid(), { lat: 12.345679, lon: -12.345679 });
    t.end();

  });

  test('extremes should be accepted', (t) => {
    const doc = new Document('mysource','mylayer','myid');

    doc.setCentroid({ lat: -90, lon: -180 });
    t.deepEquals(doc.getCentroid(), { lat: -90, lon: -180 }, 'accepts mins');

    doc.setCentroid({ lat: 0, lon: 0 });
    t.deepEquals(doc.getCentroid(), { lat: 0, lon: 0 }, 'accepts zeroes');

    doc.setCentroid({ lat: 90, lon: 180 });
    t.deepEquals(doc.getCentroid(), { lat: 90, lon: 180 }, 'accepts maxs');

    t.end();

  });

  test('latitude and longitude values outside of acceptable boundes should be rejected', (t) => {
    const doc = new Document('mysource','mylayer','myid');

    t.throws( doc.setCentroid.bind(doc, {lat: 90.000001, lon: 0 }), null, 'invalid range' );
    t.throws( doc.setCentroid.bind(doc, {lat: -90.000001, lon: 0 }), null, 'invalid range' );
    t.throws( doc.setCentroid.bind(doc, {lat: 0, lon: 180.000001 }), null, 'invalid range' );
    t.throws( doc.setCentroid.bind(doc, {lat: 0, lon: -180.000001 }), null, 'invalid range' );
    t.end();

  });

  test('modifying parameter object after setCentroid shows that source was value-copied', (t) => {
    const doc = new Document('mysource','mylayer','myid');

    const centroid = { lat: 12.121212, lon: 21.212121 };
    doc.setCentroid(centroid);

    centroid.lat = 13.131313;
    centroid.lon = 31.313131;

    t.deepEquals(doc.getCentroid(), { lat: 12.121212, lon: 21.212121 }, 'should not have changed');
    t.end();

  });

};

module.exports.all = function (tape, common) {

  function test(name, testFunction) {
    return tape('centroid: ' + name, testFunction);
  }

  for( var testCase in module.exports.tests ){
    module.exports.tests[testCase](test, common);
  }
};
