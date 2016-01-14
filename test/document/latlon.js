
var Document = require('../../Document');

module.exports.tests = {};

module.exports.tests.getLat = function(test) {
  test('getLat', function(t) {
    var doc = new Document('mysource','mylayer','myid');
    t.equal(doc.getLat(), undefined, 'getter works');
    doc.center_point.lat = 1.2;
    t.equal(doc.getLat(), 1.2, 'getter works');
    t.end();
  });
};

module.exports.tests.setLat = function(test) {
  test('setLat', function(t) {
    var doc = new Document('mysource','mylayer','myid');
    t.equal(doc.center_point.lat, undefined, 'lat undefined');
    t.equal(doc.setLat(1.3), doc, 'chainable');
    t.equal(doc.center_point.lat, 1.3, 'lat set');
    t.end();
  });
  test('setLat - validate', function(t) {
    var doc = new Document('mysource','mylayer','myid');
    t.throws( doc.setLat.bind(doc,undefined), null, 'invalid type' );
    t.throws( doc.setLat.bind(doc,'one'), null, 'invalid type' );
    t.throws( doc.setLat.bind(doc,''), null, 'invalid length' );
    t.throws( doc.setLat.bind(doc,-91), null, 'invalid range' );
    t.throws( doc.setLat.bind(doc,91), null, 'invalid range' );
    t.end();
  });
  test('setLat - transform', function(t) {
    var doc = new Document('mysource','mylayer','myid');
    t.equal(doc.center_point.lat, undefined, 'lat undefined');
    doc.setLat('1.4');
    t.equal(doc.center_point.lat, 1.4, 'accepts strings');
    doc.setLat('1.476876786');
    t.equal(doc.center_point.lat, 1.476877, 'fixed precision');
    t.end();
  });
  test('setLat - extremes', function(t) {
    var doc = new Document('mysource','mylayer','myid');
    doc.setLat(-90);
    t.equal(doc.center_point.lat, -90, 'accepts min');
    doc.setLat(0);
    t.equal(doc.center_point.lat, 0, 'accepts zero');
    doc.setLat(90);
    t.equal(doc.center_point.lat, 90, 'accepts max');
    t.end();
  });
};

module.exports.tests.getLon = function(test) {
  test('getLon', function(t) {
    var doc = new Document('mysource','mylayer','myid');
    t.equal(doc.getLon(), undefined, 'getter works');
    doc.center_point.lon = 1.2;
    t.equal(doc.getLon(), 1.2, 'getter works');
    t.end();
  });
};

module.exports.tests.setLon = function(test) {
  test('setLon', function(t) {
    var doc = new Document('mysource','mylayer','myid');
    t.equal(doc.center_point.lon, undefined, 'lat undefined');
    t.equal(doc.setLon(1.3), doc, 'chainable');
    t.equal(doc.center_point.lon, 1.3, 'lat set');
    t.end();
  });
  test('setLon - validate', function(t) {
    var doc = new Document('mysource','mylayer','myid');
    t.throws( doc.setLon.bind(doc,undefined), null, 'invalid type' );
    t.throws( doc.setLon.bind(doc,'one'), null, 'invalid type' );
    t.throws( doc.setLon.bind(doc,''), null, 'invalid length' );
    t.throws( doc.setLon.bind(doc,-181), null, 'invalid range' );
    t.throws( doc.setLon.bind(doc,181), null, 'invalid range' );
    t.end();
  });
  test('setLon - transform', function(t) {
    var doc = new Document('mysource','mylayer','myid');
    t.equal(doc.center_point.lon, undefined, 'lat undefined');
    doc.setLon('1.4');
    t.equal(doc.center_point.lon, 1.4, 'accepts strings');
    doc.setLon('1.476876786');
    t.equal(doc.center_point.lon, 1.476877, 'fixed precision');
    t.end();
  });
  test('setLon - extremes', function(t) {
    var doc = new Document('mysource','mylayer','myid');
    doc.setLon(-180);
    t.equal(doc.center_point.lon, -180, 'accepts min');
    doc.setLon(0);
    t.equal(doc.center_point.lon, 0, 'accepts zero');
    doc.setLon(+180);
    t.equal(doc.center_point.lon, 180, 'accepts max');
    t.end();
  });
};

module.exports.all = function (tape, common) {

  function test(name, testFunction) {
    return tape('latlon: ' + name, testFunction);
  }

  for( var testCase in module.exports.tests ){
    module.exports.tests[testCase](test, common);
  }
};
