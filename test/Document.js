const _ = require('lodash');
const testDocument = require('./TestDocument');
const Document = testDocument();

module.exports.tests = {};

module.exports.tests.interface = (test) => {
  test('valid interface', (t) => {
    t.equal(typeof Document, 'function', 'Document is a function');

    t.equal(typeof Document.prototype.getId, 'function', 'getId() is a function');
    t.equal(typeof Document.prototype.setId, 'function', 'setId() is a function');

    t.equal(typeof Document.prototype.getSource, 'function', 'getSource() is a function');
    t.equal(typeof Document.prototype.setSource, 'function', 'setSource() is a function');

    t.equal(typeof Document.prototype.getLayer, 'function', 'getLayer() is a function');
    t.equal(typeof Document.prototype.setLayer, 'function', 'setLayer() is a function');

    t.end();
  });
};

module.exports.tests.constructor = (test) => {
  test('constructor args', (t) => {

    const doc = new Document('mysource', 'mylayer', 'myid');

    // initial values
    t.deepEqual(doc.name, {}, 'initial value');
    t.deepEqual(doc.address_parts, {}, 'initial value');
    t.deepEqual(doc.center_point, {}, 'initial value');
    t.true(Array.isArray(doc.category), 'initial value');
    t.true(doc.hasOwnProperty('_meta'), 'initial value');

    // initialize 'parent' fields to empty arrays
    t.equal(typeof doc.parent, 'object', 'initial value');

    // setters called
    t.equal(doc.source, 'mysource', 'setter called');
    t.equal(doc.layer, 'mylayer', 'setter called');
    t.equal(doc.source_id, 'myid', 'setter called');
    t.equal(doc._meta.id, 'myid', 'setter called');

    t.end();
  });
};

module.exports.tests.clearParent = (test) => {
  test('clearParent should remove all effects of addParent calls', (t) => {
    const doc = new Document('mysource', 'mylayer', 'myid');
    doc.addParent('locality', 'name 1', 'id 1', 'abbr 1');
    doc.addParent('locality', 'name 2', 'id 2', 'abbr 2');

    t.deepEqual(doc.parent.locality, ['name 1', 'name 2'], 'should be empty');
    t.deepEqual(doc.parent.locality_id, ['id 1', 'id 2'], 'should be empty');
    t.deepEqual(doc.parent.locality_a, ['abbr 1', 'abbr 2'], 'should be empty');

    doc.clearParent('locality');

    t.deepEqual(doc.parent.locality, [], 'should be empty');
    t.deepEqual(doc.parent.locality_id, [], 'should be empty');
    t.deepEqual(doc.parent.locality_a, [], 'should be empty');

    t.end();

  });
};

module.exports.tests.clearAllParents = (test) => {
  test('clearParents should remove all effects of all addParent calls', (t) => {
    const doc = new Document('mysource', 'mylayer', 'myid');
    doc.getParentFields().forEach((type) => {
      doc.addParent(type, 'name 1', 'id 1', 'abbr 1');
      doc.addParent(type, 'name 2', 'id 2', 'abbr 2');
    });

    doc.getParentFields().forEach((type) => {
      t.equals(doc.parent[type].length, 2, `there should be 2 of type ${type}`);
    });

    t.equals(doc.clearAllParents(), doc, 'is chainable');

    doc.getParentFields().forEach((type) => {
      t.equals(doc.parent[type].length, 0, `there should be 0 of type ${type}`);
    });

    t.end();

  });

};

module.exports.tests.parent_types = (test) => {
  test('supported WOF placetypes should return true', (t) => {
    const doc = new Document('mysource', 'mylayer', 'myid');

    t.deepEquals(doc.getParentFields(), [
      'continent',
      'country',
      'dependency',
      'macroregion',
      'region',
      'macrocounty',
      'county',
      'borough',
      'locality',
      'localadmin',
      'macrohood',
      'neighbourhood',
      'postalcode',
      'ocean',
      'marinearea',
      'empire'
    ]);

    t.end();

  });

  test('supported WOF placetypes should return true', (t) => {
    const doc = new Document('mysource', 'mylayer', 'myid');

    doc.getParentFields().forEach((type) => {
      t.ok(doc.isSupportedParent(type), `${type} should be supported`);
    });

    t.end();

  });

  test('abbreviation and id names for WOF placetypes should return false', (t) => {
    const doc = new Document('mysource', 'mylayer', 'myid');

    // this verifies that _a and _id parents aren't supported
    doc.getParentFields().forEach((type) => {
      t.notOk(doc.isSupportedParent(`${type}_a`), `${type}_a should not be supported`);
      t.notOk(doc.isSupportedParent(`${type}_id`), `${type}_id should not be supported`);
    });

    t.end();

  });

  test('non-WOF placetype arguments should return false', (t) => {
    const doc = new Document('mysource', 'mylayer', 'myid');

    const placetype = 'unsupported placetype';

    // push a new placetype to show that it's a clone of the internal list
    doc.getParentFields().push(placetype);

    t.notOk(doc.isSupportedParent(placetype), 'should be false');
    t.end();

  });

};

module.exports.tests.addendum_namespaces = (test) => {
  test('addendum namespace configured as array should be validated and kept as array in ESDocument', (t) => {

    const Document = testDocument({
      addendum_namespaces: {
        tariff_zone_ids: {
          type: 'array'
        }
      }
    });
    const doc = new Document('mysource', 'mylayer', 'myid');
    doc.setAddendum('tariff_zone_ids', ['12', '34', '56']);

    const esDocument = doc.toESDocument();
    t.true(_.isArray(esDocument.data.addendum.tariff_zone_ids), 'should be array');
    t.end();
  });

  test('addendum namespace configured as object should be validated and kept as object in ESDocument', (t) => {

    const Document = testDocument({
      addendum_namespaces: {
        tariff_zone_ids: {
          type: 'object'
        }
      }
    });
    const doc = new Document('mysource', 'mylayer', 'myid');
    doc.setAddendum('tariff_zone_ids', { id: '123' });

    const esDocument = doc.toESDocument();
    t.true(_.isObject(esDocument.data.addendum.tariff_zone_ids), 'should be object');
    t.deepEqual(esDocument.data.addendum.tariff_zone_ids, { id: '123' }, 'should be a valid object');
    t.end();
  });

  test('addendum namespace configured as array should be validated and kept as array in ESDocument', (t) => {

    const Document = testDocument({
      addendum_namespaces: {
        tariff_zone_ids: {
          type: 'array'
        }
      }
    });
    const doc = new Document('mysource', 'mylayer', 'myid');
    doc.setAddendum('tariff_zone_ids', ['123', '456', '789']);

    const esDocument = doc.toESDocument();
    t.true(_.isArray(esDocument.data.addendum.tariff_zone_ids), 'should be array');
    t.deepEqual(esDocument.data.addendum.tariff_zone_ids, ['123', '456', '789'], 'should be a valid array');
    t.end();
  });

  test('addendum namespace not configured should be validated as object and kept as encoded string in ESDocument',
    (t) => {
      const Document = testDocument();
      const doc = new Document('mysource', 'mylayer', 'myid');
      doc.setAddendum('tariff_zone_ids', { id: '123' });

      const esDocument = doc.toESDocument();
      t.false(_.isObject(esDocument.data.addendum.tariff_zone_ids), 'should not be object');
      t.equal(esDocument.data.addendum.tariff_zone_ids, '{"id":"123"}', 'should be encoded object string');
      t.end();
    });

  test('mix of configured and non-configured addendum namespaces should be properly handled',
    (t) => {
      const Document = testDocument({
        addendum_namespaces: {
          description: {
            type: 'object'
          }
        }
      });
      const doc = new Document('mysource', 'mylayer', 'myid');
      doc.setAddendum('tariff_zone_ids', { id: '123' });
      doc.setAddendum('description', { nor: 'this is something' });

      const esDocument = doc.toESDocument();
      t.false(_.isObject(esDocument.data.addendum.tariff_zone_ids), 'should not be object');
      t.equal(esDocument.data.addendum.tariff_zone_ids, '{"id":"123"}', 'should be encoded object string');
      t.true(_.isObject(esDocument.data.addendum.description), 'should be object');
      t.deepEqual(esDocument.data.addendum.description, { nor: 'this is something' }, 'should be object');
      t.end();
    });

  test('setAddendum should fail if the configured type does not match with provided data', (t) => {

    const Document = testDocument({
      addendum_namespaces: {
        tariff_zone_ids: {
          type: 'array'
        }
      }
    });
    const doc = new Document('mysource', 'mylayer', 'myid');

    t.throws(
      () => doc.setAddendum('tariff_zone_ids', '12,34,56'),
      /invalid document type, expecting: array got: 12,34,56/,
      'Should fail for invalid data type.');

    t.end();
  });

  test('non-configured type should always be a valid object', (t) => {

    const doc = new Document('mysource', 'mylayer', 'myid');

    t.throws(
      () => doc.setAddendum('tariff_zone_ids', [123, 456, 789]),
      /invalid document type, expecting: object, got array: 123,456,789/,
      'Should always be a object');

    t.end();
  });
};

module.exports.all = function (tape, common) {

  function test(name, testFunction) {
    return tape('Document: ' + name, testFunction);
  }

  for (const testCase in module.exports.tests) {
    module.exports.tests[testCase](test, common);
  }
};
