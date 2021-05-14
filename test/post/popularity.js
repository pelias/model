const Document = require('../../Document');
const popularity = require('../../post/popularity');

module.exports.tests = {};

const MIN_POSTCODE_POPULARITY = 9000;
module.exports.tests.postalcode = function (test) {
  test('postalcode - empty', function (t) {
    var doc = new Document('mysource', 'postalcode', 'myid');

    popularity(doc);
    t.deepEquals(doc.getPopularity(), MIN_POSTCODE_POPULARITY);

    t.end();
  });
  test('postalcode - zero', function (t) {
    var doc = new Document('mysource', 'postalcode', 'myid');
    doc.setPopularity(0);

    popularity(doc);
    t.deepEquals(doc.getPopularity(), MIN_POSTCODE_POPULARITY);

    t.end();
  });
  test('postalcode - above minimum', function (t) {
    var doc = new Document('mysource', 'postalcode', 'myid');
    doc.setPopularity(9999999);

    popularity(doc);
    t.deepEquals(doc.getPopularity(), 9999999);

    t.end();
  });
  test('postalcode - below minimum', function (t) {
    var doc = new Document('mysource', 'postalcode', 'myid');
    doc.setPopularity(100);

    popularity(doc);
    t.deepEquals(doc.getPopularity(), MIN_POSTCODE_POPULARITY);

    t.end();
  });
};

// layers not listed in MIN_POPULARITY_MAP should result in a no-op
module.exports.tests.noop = function (test) {
  test('other layers - no-op', function (t) {
    var doc = new Document('mysource', 'mylayer', 'myid');

    popularity(doc);
    t.deepEquals(doc.getPopularity(), undefined);

    t.end();
  });
};

module.exports.all = function (tape, common) {

  function test(name, testFunction) {
    return tape('post/popularity: ' + name, testFunction);
  }

  for (var testCase in module.exports.tests) {
    module.exports.tests[testCase](test, common);
  }
};
