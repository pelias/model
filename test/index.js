
var index = require('../');

module.exports.tests = {};

module.exports.tests.interface = function(test, common) {
  test('valid interface', function(t) {
    t.equal(typeof index, 'object', 'index is exported correctly');
    t.equal(typeof index.Document, 'function', 'Document is a exported');
    t.equal(typeof index.Centroid, 'function', 'Centroid is a exported');
    t.end();
  });
};

module.exports.all = function (tape, common) {

  function test(name, testFunction) {
    return tape('index: ' + name, testFunction);
  }

  for( var testCase in module.exports.tests ){
    module.exports.tests[testCase](test, common);
  }
};