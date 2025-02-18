const Document = require('../../Document');
const housenumber = require('../../post/zero_prefixed_house_numbers');

module.exports.tests = {};

module.exports.tests.noop = function(test) {
  test('noop: house number not set', function(t) {
    const doc = new Document('mysource', 'mylayer', 'myid');

    housenumber(doc);

    // no action taken
    t.equal(doc.getAddress('number'), undefined, 'not set');

    t.end();
  });

  test('noop: house no leading zero', function(t) {
    const doc = new Document('mysource', 'mylayer', 'myid');
    doc.setAddress('number', '10');

    housenumber(doc);

    // no action taken
    t.equal(doc.getAddress('number'), '10', 'no change');

    t.end();
  });

  test('noop: house no is literally zero', function(t) {
    const doc = new Document('mysource', 'mylayer', 'myid');
    doc.setAddress('number', '0');

    housenumber(doc);

    // no action taken
    t.equal(doc.getAddress('number'), '0', 'no change');

    t.end();
  });
};

module.exports.tests.strip_prefix = function(test) {
  test('strip: house number with zero prefix', function(t) {
    const doc = new Document('mysource', 'mylayer', 'myid');
    doc.setAddress('number', '010');

    housenumber(doc);

    // prefix removed
    t.equal(doc.getAddress('number'), '10', 'prefix removed');

    t.end();
  });

  test('strip: house number with multiple zero prefix', function(t) {
    const doc = new Document('mysource', 'mylayer', 'myid');
    doc.setAddress('number', '000000001000');

    housenumber(doc);

    // prefix removed
    t.equal(doc.getAddress('number'), '1000', 'prefix removed');

    t.end();
  });

  test('strip: house number with multiple zero prefix plus multiple whitespace', function(t) {
    const doc = new Document('mysource', 'mylayer', 'myid');
    doc.setAddress('number', '       000000009990');

    housenumber(doc);

    // prefix removed
    t.equal(doc.getAddress('number'), '9990', 'prefix removed');

    t.end();
  });
};

module.exports.all = function (tape, common) {

  function test(name, testFunction) {
    return tape('post/zero_prefixed_house_numbers: ' + name, testFunction);
  }

  for( var testCase in module.exports.tests ){
    module.exports.tests[testCase](test, common);
  }
};
