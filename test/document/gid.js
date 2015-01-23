
var Document = require('../../Document');

module.exports.tests = {};

module.exports.tests.getGid = function(test) {
  test('getGid', function(t) {
    var doc = new Document('mytype','myid');
    t.equal(doc.getGid(), 'myid:mytype', 'getter works');
    t.end();
  });
};

module.exports.all = function (tape, common) {

  function test(name, testFunction) {
    return tape('gid: ' + name, testFunction);
  }

  for( var testCase in module.exports.tests ){
    module.exports.tests[testCase](test, common);
  }
};
