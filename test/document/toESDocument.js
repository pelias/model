var Document = require('../../Document');

module.exports.tests = {};

module.exports.tests.toESDocument = function(test) {
  test('toESDocument', function(t) {

    var doc = new Document('mysource','mylayer','myid');
    var esDoc = doc.toESDocument();

    var expected = {
      _index: 'pelias',
      _type: 'mylayer',
      _id: 'myid',
      data: {
        layer: 'mylayer',
        parent: {},
        source: 'mysource',
        source_id: 'myid'
      }
    };

    t.deepEqual(esDoc, expected, 'creates correct elasticsearch document');

    // test that empty arrays/object are stripped from the doc before sending it
    // downstream to elasticsearch.
    t.false(esDoc.data.hasOwnProperty('address_parts'), 'does not include empty top-level maps');
    t.false(esDoc.data.hasOwnProperty('category'), 'does not include empty top-level arrays');
    t.false(esDoc.data.parent.hasOwnProperty('country'), 'does not include empty parent arrays');
    t.end();
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
