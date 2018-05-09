const codec = require('../../codec/codec.js');
const Document = require('../../Document.js');

module.exports.tests = {};

module.exports.tests.interface = function(test) {
  test('valid interface', function(t) {
    // t.equal(typeof Document, 'function', 'Document is a function');

    // t.equal(typeof Document.prototype.getId, 'function', 'getId() is a function');
    // t.equal(typeof Document.prototype.setId, 'function', 'setId() is a function');

    // t.equal(typeof Document.prototype.getType, 'function', 'getType() is a function');
    // t.equal(typeof Document.prototype.setType, 'function', 'setType() is a function');

    // t.equal(typeof Document.prototype.getSource, 'function', 'getSource() is a function');
    // t.equal(typeof Document.prototype.setSource, 'function', 'setSource() is a function');

    // t.equal(typeof Document.prototype.getLayer, 'function', 'getLayer() is a function');
    // t.equal(typeof Document.prototype.setLayer, 'function', 'setLayer() is a function');

    t.end();
  });
};

// --- example codec ---

module.exports.tests.exampleEncode = function(test) {
  test('exampleEncode', function(t) {

    const encoded = new Buffer('\r\x00\x00(B\x12\x0bhello world');
    const decoded = {
      num: 42,
      payload: 'hello world'
    };

    t.deepEqual(codec.example.Test.encode(decoded), encoded);
    t.end();
  });
};

module.exports.tests.exampleDecode = function(test) {
  test('exampleDecode', function(t) {

    const encoded = new Buffer('\r\x00\x00(B\x12\x0bhello world');
    const decoded = {
      num: 42,
      payload: 'hello world'
    };

    t.deepEqual(codec.example.Test.decode(encoded), decoded);
    t.end();
  });
};

// --- v1 codec ---

module.exports.tests.v1Encode = function(test) {
  test('v1Encode', function(t) {

    const encoded = new Buffer('\n\x19\n\bmysource\x12\x07mylayer\x1a\x04myid' +
      '\x12\n\n\x02id\x12\x04myid\x12\x0f\n\x04type\x12\x07mylayer\x1a\x12\n\x06myprop' +
      '\x12\b\x12\x06myname"\x07\n\x03WOF\x12\x002\f\n\nPopulation2\f\n\nPopularityB\x00');

    var doc = new Document('mysource','mylayer','myid');
    doc.setName('myprop', 'myname');

    t.deepEqual(codec.v1.Location.encode(doc), encoded);
    t.end();
  });
};

module.exports.tests.v1Decode = function(test) {
  test('v1Decode', function(t) {

    const encoded = new Buffer('\n\x19\n\bmysource\x12\x07mylayer\x1a\x04myid' +
      '\x12\n\n\x02id\x12\x04myid\x12\x0f\n\x04type\x12\x07mylayer\x1a\x12\n\x06myprop' + 
      '\x12\b\x12\x06myname"\x07\n\x03WOF\x12\x002\f\n\nPopulation2\f\n\nPopularityB\x00');

    var doc = new Document('mysource','mylayer','myid');
    doc.setName('myprop', 'myname');

    t.deepEqual(codec.v1.Location.decode(encoded), doc);
    t.end();
  });
};

module.exports.tests.v1Symmetry = function(test) {
  test('v1Symmetry', function(t) {

    var doc = new Document('mysource','mylayer','myid')
      .setMeta( 'author', 'peter' )
      .setName( 'default', 'Hackney City Farm' )
      .setName( 'alt', 'Haggerston City Farm' )
      .setNameAlias( 'alt', 'Haggerston Farm' )
      .addParent( 'country', 'Great Britain', '1001', 'GreatB' )
      .addParent( 'neighbourhood', 'Shoreditch', '2002' )
      .setAddress('name', 'address name')
      .setAddress('number', 'address number')
      .setAddress('street', 'address street')
      .setAddress('zip', 'address zip')
      .setAddress('unit', 'address unit')
      .addCategory( 'foo' )
      .addCategory( 'bar' )
      .removeCategory( 'foo' )
      .setPopulation(10)
      .setPopularity(3)
      .setCentroid({ lon: 0.5, lat: 50.1 })
      .setPolygon({ type: 'Point', coordinates: [1, 2] })
      .setBoundingBox({
        upperLeft: {
          lat: 13.131313,
          lon: 21.212121
        },
        lowerRight: {
          lat: 12.121212,
          lon: 31.313131
        }
      });

    let encoded = codec.v1.Location.encode(doc);
    let decoded = codec.v1.Location.decode(encoded);

    t.deepEqual(decoded, doc);
    t.deepEqual(decoded._meta, doc._meta);
    t.deepEqual(encoded.length, 614);
    t.end();
  });
};

module.exports.all = function (tape, common) {

  function test(name, testFunction) {
    return tape('codec: ' + name, testFunction);
  }

  for( var testCase in module.exports.tests ){
    module.exports.tests[testCase](test, common);
  }
};
