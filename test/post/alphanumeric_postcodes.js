const Document = require('../../Document');
const postcodes = require('../../post/alphanumeric_postcodes');

module.exports.tests = {};

module.exports.tests.alias = function(test) {
  test('expand', function(t) {
    const doc = new Document('mysource','address','myid');

    // zip not set
    postcodes(doc);
    t.deepEqual(doc.getAddressAliases('zip'), [], 'no alias set');

    // set postcode
    doc.setAddress('zip', '1383GN');

    // add expanded version
    postcodes(doc);
    t.deepEqual(doc.getAddressAliases('zip'), ['1383 GN'], 'alias set');

    t.end();
  });
  test('contract', function(t) {
    const doc = new Document('mysource','address','myid');

    // zip not set
    postcodes(doc);
    t.deepEqual(doc.getAddressAliases('zip'), [], 'no alias set');

    // set postcode
    doc.setAddress('zip', '1383 GN');

    // add contracted version
    postcodes(doc);
    t.deepEqual(doc.getAddressAliases('zip'), ['1383GN'], 'alias set');

    t.end();
  });
};

module.exports.tests.noop = function(test) {
  test('noop: invalid layer != "address"', function(t) {
    const doc = new Document('mysource','not_address','myid');

    // set postcode
    doc.setAddress('zip', '1383GN');

    // no alias added
    t.deepEqual(doc.getAddressAliases('zip'), [], 'no alias set');

    t.end();
  });

  test('noop: postcode doesnt match regex', function(t) {
    const doc = new Document('mysource','address','myid');

    // set postcode
    doc.setAddress('zip', 'E81DN');

    // no alias added
    t.deepEqual(doc.getAddressAliases('zip'), [], 'no alias set');

    t.end();
  });

  test('noop: no postcode', function(t) {
    const doc = new Document('mysource','address','myid');

    // no alias added
    t.deepEqual(doc.getAddressAliases('zip'), [], 'no alias set');

    t.end();
  });

  test('noop: no numeric', function(t) {
    const doc = new Document('mysource','address','myid');

    // set postcode
    doc.setAddress('zip', '3040');

    // no alias added
    t.deepEqual(doc.getAddressAliases('zip'), [], 'no alias set');

    t.end();
  });
};

module.exports.all = function (tape, common) {

  function test(name, testFunction) {
    return tape('post/alphanumeric_postcodes: ' + name, testFunction);
  }

  for( var testCase in module.exports.tests ){
    module.exports.tests[testCase](test, common);
  }
};
