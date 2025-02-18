const Document = require('../../Document');
const housenumber = require('../../post/zero_prefixed_house_numbers');

module.exports.tests = {};

module.exports.tests.noop = function(test) {
  test('noop: house number not set', function(t) {
    const doc = new Document('mysource', 'address', 'myid');

    housenumber(doc);

    // no action taken
    t.equal(doc.getAddress('number'), undefined, 'not set');

    t.end();
  });

  test('noop: house no leading zero', function(t) {
    const doc = new Document('mysource', 'address', 'myid');
    doc.setAddress('number', '10');

    housenumber(doc);

    // no action taken
    t.equal(doc.getAddress('number'), '10', 'no change');

    t.end();
  });

  test('noop: house no is literally zero', function(t) {
    const doc = new Document('mysource', 'address', 'myid');
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

  test('strip: house number with multiple zeros', function(t) {
    const doc = new Document('mysource', 'mylayer', 'myid');
    doc.setAddress('number', '00000');

    housenumber(doc);

    // prefix removed
    t.equal(doc.getAddress('number'), '0', 'prefix removed');

    t.end();
  });
};

module.exports.tests.update_names = function(test) {
  test('name: scalar', function(t) {
    const doc = new Document('mysource', 'address', 'myid');
    doc.setAddress('number', '010');
    doc.setAddress('street', 'Main Street');
    doc.setName('default', '010 Main Street');

    housenumber(doc);

    // prefix removed
    t.equal(doc.getAddress('number'), '10', 'prefix removed');
    t.equal(doc.getAddress('street'), 'Main Street', 'no-op');
    t.equal(doc.getName('default'), '10 Main Street', 'prefix removed');

    t.end();
  });

  test('name: array', function(t) {
    const doc = new Document('mysource', 'address', 'myid');
    doc.setAddress('number', '010');
    doc.setAddress('street', 'Main Street');
    doc.setName('default', '010 Main Street');
    doc.setNameAlias('default', '010 Main Street');

    housenumber(doc);

    // prefix removed
    t.equal(doc.getAddress('number'), '10', 'prefix removed');
    t.equal(doc.getAddress('street'), 'Main Street', 'no-op');
    t.equal(doc.getName('default'), '10 Main Street', 'prefix removed');
    t.deepEqual(doc.getNameAliases('default'), ['10 Main Street'], 'prefix removed');

    t.end();
  });

  test('name: scalar - invert', function(t) {
    const doc = new Document('mysource', 'address', 'myid');
    doc.setAddress('number', '010');
    doc.setAddress('street', 'Hauptstraße');
    doc.setName('default', 'Hauptstraße 010');

    housenumber(doc);

    // prefix removed
    t.equal(doc.getAddress('number'), '10', 'prefix removed');
    t.equal(doc.getAddress('street'), 'Hauptstraße', 'no-op');
    t.equal(doc.getName('default'), 'Hauptstraße 10', 'prefix removed');

    t.end();
  });

  test('name: array - invert', function(t) {
    const doc = new Document('mysource', 'address', 'myid');
    doc.setAddress('number', '010');
    doc.setAddress('street', 'Hauptstraße');
    doc.setName('default', 'Hauptstraße 010');
    doc.setNameAlias('default', 'Hauptstraße 010');

    housenumber(doc);

    // prefix removed
    t.equal(doc.getAddress('number'), '10', 'prefix removed');
    t.equal(doc.getAddress('street'), 'Hauptstraße', 'no-op');
    t.equal(doc.getName('default'), 'Hauptstraße 10', 'prefix removed');
    t.deepEqual(doc.getNameAliases('default'), ['Hauptstraße 10'], 'prefix removed');

    t.end();
  });

  test('name: scalar - infix ignored', function(t) {
    const doc = new Document('mysource', 'address', 'myid');
    doc.setAddress('number', '010');
    doc.setAddress('street', '0100 Street');
    doc.setName('default', '010 0100 Street');

    housenumber(doc);

    // prefix removed
    t.equal(doc.getAddress('number'), '10', 'prefix removed');
    t.equal(doc.getAddress('street'), '0100 Street', 'no-op');
    t.equal(doc.getName('default'), '10 0100 Street', 'prefix removed');

    t.end();
  });

  test('name: scalar - unit maintained', function(t) {
    const doc = new Document('mysource', 'address', 'myid');
    doc.setAddress('number', '010');
    doc.setAddress('unit', '1A');
    doc.setAddress('street', 'Main Street');
    doc.setName('default', '1A 010 Main Street');

    housenumber(doc);

    // prefix removed
    t.equal(doc.getAddress('number'), '10', 'prefix removed');
    t.equal(doc.getAddress('unit'), '1A', 'no-op');
    t.equal(doc.getAddress('street'), 'Main Street', 'no-op');
    t.equal(doc.getName('default'), '1A 10 Main Street', 'prefix removed');

    t.end();
  });

  test('name: scalar - ordinal ignored', function(t) {
    const doc = new Document('mysource', 'address', 'myid');
    doc.setAddress('number', '010');
    doc.setAddress('street', '010th Street');
    doc.setName('default', '010 010th Street');

    housenumber(doc);

    // prefix removed
    t.equal(doc.getAddress('number'), '10', 'prefix removed');
    t.equal(doc.getAddress('street'), '010th Street', 'no-op');
    t.equal(doc.getName('default'), '10 010th Street', 'prefix removed');

    t.end();
  });

  test('name: scalar - only first match replaced', function(t) {
    const doc = new Document('mysource', 'address', 'myid');
    doc.setAddress('number', '010');
    doc.setAddress('street', '010 Street');
    doc.setName('default', '010 010 Street');

    housenumber(doc);

    // prefix removed
    t.equal(doc.getAddress('number'), '10', 'prefix removed');
    t.equal(doc.getAddress('street'), '010 Street', 'no-op');
    t.equal(doc.getName('default'), '10 010 Street', 'prefix removed');

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
