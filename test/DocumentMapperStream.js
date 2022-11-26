const createDocumentMapperStream = require('../DocumentMapperStream');
const testDocument = require('./TestDocument');

const stream_mock = require('stream-mock');
const Document = testDocument();

function test_stream(input, testedStream, callback) {
  const reader = new stream_mock.ObjectReadableMock(input);
  const writer = new stream_mock.ObjectWritableMock();
  writer.on('error', (e) => callback(e));
  writer.on('finish', () => callback(null, writer.data));
  reader.pipe(testedStream).pipe(writer);
}

module.exports.tests = {};

module.exports.tests.DocumentMapperStream = function(test) {
  test('createDocumentMapperStream', function(t) {
    const stream = createDocumentMapperStream();
    const document = new Document('source', 'layer', 'id');

    test_stream([document], stream, function(err, results) {
      t.equal(results.length, 1, 'stream returns exactly one result');
      t.deepEqual(results[0], document.toESDocument(),
        'stream transforms Document into object ready to be inserted into Elasticsearch');
      t.end();
    });
  });
};

module.exports.all = function (tape, common) {
  function test(name, testFunction) {
    return tape('DocumentMapperStream: ' + name, testFunction);
  }

  for( const testCase in module.exports.tests ){
    module.exports.tests[testCase](test, common);
  }
};
