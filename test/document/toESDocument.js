const proxyquire = require('proxyquire');
const codec = require('../../codec');

var fakeGeneratedConfig = {
  schema: {
    indexName: 'pelias'
  }
};

const fakeConfig = {
  generate: function fakeGenerate() {
    return fakeGeneratedConfig;
  }
};


module.exports.tests = {};

module.exports.tests.toESDocument = function(test) {
  test('toESDocument', function(t) {
    var Document = proxyquire('../../Document', { 'pelias-config': fakeConfig });

    var doc = new Document('mysource','mylayer','myid');
    doc.setName('myprop', 'myname');
    doc.setAddress('name', 'address name');
    doc.setAddress('number', 'address number');
    doc.setAddress('street', 'address street');
    doc.setAddress('zip', 'address zip');
    doc.setAddress('unit', 'address unit');
    doc.setBoundingBox({
      upperLeft: {
        lat: 13.131313,
        lon: 21.212121
      },
      lowerRight: {
        lat: 12.121212,
        lon: 31.313131
      }
    });
    doc.setPopulation(123);
    doc.setPopularity(456);
    doc.setPolygon({ key: 'value' });
    doc.addCategory('category 1');
    doc.addCategory('category 2');
    doc.setAddendum('wikipedia', { slug: 'HackneyCityFarm' });
    doc.setAddendum('geonames', { foreignkey: 1 });

    var esDoc = doc.toESDocument();

    var expected = {
      _index: 'pelias',
      _type: 'mylayer',
      _id: 'myid',
      data: {
        layer: 'mylayer',
        name: {
          myprop: 'myname'
        },
        phrase: {
          myprop: 'myname'
        },
        address_parts: {
          name: 'address name',
          number: 'address number',
          street: 'address street',
          zip: 'address zip',
          unit: 'address unit'
        },
        source: 'mysource',
        source_id: 'myid',
        bounding_box: '{"min_lat":12.121212,"max_lat":13.131313,"min_lon":21.212121,"max_lon":31.313131}',
        population: 123,
        popularity: 456,
        polygon: {
          key: 'value'
        },
        category: [
          'category 1',
          'category 2'
        ],
        addendum: {
          wikipedia: codec.encode({ slug: 'HackneyCityFarm' }),
          geonames: codec.encode({ foreignkey: 1 })
        }
      }
    };

    t.deepEqual(esDoc, expected, 'creates correct elasticsearch document');
    t.end();
  });

  test('toESDocumentWithNameAliases', function(t) {
    var Document = proxyquire('../../Document', { 'pelias-config': fakeConfig });

    var doc = new Document('mysource','mylayer','myid');
    doc.setName('myprop', 'myname');
    doc.setNameAlias('myprop', 'myname2');
    doc.setNameAlias('myprop', 'myname3');

    var esDoc = doc.toESDocument();

    var expected = {
      _index: 'pelias',
      _type: 'mylayer',
      _id: 'myid',
      data: {
        source: 'mysource',
        layer: 'mylayer',
        source_id: 'myid',
        name: {
          myprop: [ 'myname', 'myname2', 'myname3' ]
        },
        phrase: {
          myprop: [ 'myname', 'myname2', 'myname3' ]
        }
      }
    };

    t.deepEqual(esDoc, expected, 'creates correct elasticsearch document');
    t.end();
  });

  test('unset properties should not output in toESDocument', (t) => {
    const Document = proxyquire('../../Document', { 'pelias-config': fakeConfig });

    const esDoc = new Document('mysource','mylayer','myid').toESDocument();

    // test that empty arrays/object are stripped from the doc before sending it
    // downstream to elasticsearch.
    t.false(esDoc.data.hasOwnProperty('address_parts'), 'does not include empty top-level maps');
    t.false(esDoc.data.hasOwnProperty('category'), 'does not include empty top-level arrays');
    t.false(esDoc.data.hasOwnProperty('parent'), 'does not include empty parent arrays');
    t.false(esDoc.data.hasOwnProperty('bounding_box'), 'should not include bounding_box');
    t.false(esDoc.data.hasOwnProperty('center_point'), 'should not include center');
    t.false(esDoc.data.hasOwnProperty('population'), ' should not include population');
    t.false(esDoc.data.hasOwnProperty('popularity'), ' should not include popularity');
    t.false(esDoc.data.hasOwnProperty('polygon'), ' should not include polygon');
    t.end();

  });

  test('toESDocumentWithAddressAliases', function(t) {
    var Document = proxyquire('../../Document', { 'pelias-config': fakeConfig });

    var doc = new Document('mysource','mylayer','myid');
    doc.setAddress('name', 'address name');
    doc.setAddress('number', 'address number');
    doc.setAddressAlias('street', 'astreet');
    doc.setAddress('street', 'address street');
    doc.setAddress('zip', 'address zip');
    doc.setAddressAlias('zip', 'azip');
    doc.setAddress('unit', 'address unit');

    var esDoc = doc.toESDocument();

    var expected = {
      _index: 'pelias',
      _type: 'mylayer',
      _id: 'myid',
      data: {
        source: 'mysource',
        layer: 'mylayer',
        source_id: 'myid',
        address_parts: {
          name: 'address name',
          number: 'address number',
          street: ['address street','astreet'],
          zip: ['address zip','azip'],
          unit: 'address unit'
        },
        name: {},
        phrase: {}
      }
    };

    t.deepEqual(esDoc, expected, 'creates correct elasticsearch document');
    t.end();
  });

  test('unset properties should not output in toESDocument', (t) => {
    const Document = proxyquire('../../Document', { 'pelias-config': fakeConfig });

    const esDoc = new Document('mysource','mylayer','myid').toESDocument();

    // test that empty arrays/object are stripped from the doc before sending it
    // downstream to elasticsearch.
    t.false(esDoc.data.hasOwnProperty('address_parts'), 'does not include empty top-level maps');
    t.false(esDoc.data.hasOwnProperty('category'), 'does not include empty top-level arrays');
    t.false(esDoc.data.hasOwnProperty('parent'), 'does not include empty parent arrays');
    t.false(esDoc.data.hasOwnProperty('bounding_box'), 'should not include bounding_box');
    t.false(esDoc.data.hasOwnProperty('center_point'), 'should not include center');
    t.false(esDoc.data.hasOwnProperty('population'), ' should not include population');
    t.false(esDoc.data.hasOwnProperty('popularity'), ' should not include popularity');
    t.false(esDoc.data.hasOwnProperty('polygon'), ' should not include polygon');
    t.end();

  });

};

module.exports.tests.toESDocumentWithCustomConfig = function(test) {
  test('toESDocument with custom config', function(t) {
    fakeGeneratedConfig = {
      schema: {
        indexName: 'alternateindexname'
      }
    };

    var Document = proxyquire('../../Document', { 'pelias-config': fakeConfig });

    var doc = new Document('mysource','mylayer','myid');
    var esDoc = doc.toESDocument();

    t.deepEqual(esDoc._index, 'alternateindexname', 'document has correct index');

    t.end();
  });
};

module.exports.tests.toESDocumentCallsProcessingScripts = function(test) {
  test('toESDocument must call all post-processing scripts', function(t) {
    let Document = proxyquire('../../Document', { 'pelias-config': fakeConfig });
    let doc = new Document('mysource','mylayer','myid');
    doc._post = []; // remove any default scripts
    t.plan(3);

    // document pointer passed as first arg to scripts
    doc.addPostProcessingScript((ref) => t.equal(doc, ref));
    doc.addPostProcessingScript((ref) => t.equal(doc, ref));
    doc.addPostProcessingScript((ref) => t.equal(doc, ref));

    // toESDocument() should, in tern, call callPostProcessingScripts()
    doc.toESDocument();
  });
};

module.exports.all = function (tape, common) {
  function test(name, testFunction) {
    return tape('Document: ' + name, testFunction);
  }

  for( var testCase in module.exports.tests ){
    module.exports.tests[testCase](test, common);
  }
};
