
var Document = require('../Document');

module.exports.tests = {};

module.exports.tests.interface = function(test, common) {
  test('valid interface', function(t) {
    t.equal(typeof Document, 'function', 'Document is a function');

    t.equal(typeof Document.prototype.getId, 'function', 'getId() is a function');
    t.equal(typeof Document.prototype.setId, 'function', 'setId() is a function');

    t.equal(typeof Document.prototype.getType, 'function', 'getType() is a function');
    t.equal(typeof Document.prototype.setType, 'function', 'setType() is a function');

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