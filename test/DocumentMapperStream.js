var event_stream = require('event-stream');

var createDocumentMapperStream = require('../DocumentMapperStream');
var Document = require('../Document');

function test_stream(input, testedStream, callback) {
  var input_stream = event_stream.readArray(input);
  var destination_stream = event_stream.writeArray(callback);

  input_stream.pipe(testedStream).pipe(destination_stream);
}

module.exports.tests = {};

module.exports.tests.DocumentMapperStream = function(test) {
  test('createDocumentMapperStream', function(t) {
    var stream = createDocumentMapperStream();
    var document = new Document('source', 'layer', 'id');

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

  for( var testCase in module.exports.tests ){
    module.exports.tests[testCase](test, common);
  }
};
