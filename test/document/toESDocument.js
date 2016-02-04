var Document = require('../../Document');

module.exports.tests = {};

module.exports.tests.toESDocument = function(test) {
  test('toESDocument', function(t) {
    var doc = new Document('mysource','mylayer','myid');
    var expected = {
      _index: 'pelias',
      _type: 'mylayer',
      _id: 'myid',
      data: doc
    };
    t.deepEqual(doc.toESDocument(), expected, 'creates correct elasticsearch document');
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
