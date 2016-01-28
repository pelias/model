
var Document = require('../../Document');

module.exports.tests = {};

module.exports.tests.default = function(test) {
  test('constructor default', function(t) {
    var doc = new Document('mysource','mylayer','myid');
    t.deepEqual(doc.category, [], 'default category to empty array');
    t.end();
  });
};

module.exports.tests.addCategory = function(test) {
  test('addCategory', function(t) {
    var doc = new Document('mysource','mylayer','myid');
    doc.category = ['bar'];
    doc.addCategory('foo');
    t.deepEqual(doc.category, ['bar','foo'], 'add works');
    t.end();
  });
  test('addCategory - lowercase', function(t) {
    var doc = new Document('mysource','mylayer','myid');
    doc.category = [];
    doc.addCategory('FOO');
    t.deepEqual(doc.category, ['foo'], 'lowercase works');
    t.end();
  });
  test('addCategory - remove duplicates', function(t) {
    var doc = new Document('mysource','mylayer','myid');
    doc.category = [];
    doc.addCategory('FOO');
    doc.addCategory('foo');
    t.deepEqual(doc.category, ['foo'], 'remove duplicates');
    t.end();
  });
};

module.exports.tests.removeCategory = function(test) {
  test('removeCategory', function(t) {
    var doc = new Document('mysource','mylayer','myid');
    doc.category = ['foo'];
    doc.removeCategory('foo');
    t.deepEqual(doc.category, [], 'remove works');
    t.end();
  });
  test('removeCategory - all occurences', function(t) {
    var doc = new Document('mysource','mylayer','myid');
    doc.category = ['foo','foo','bar'];
    doc.removeCategory('foo');
    t.deepEqual(doc.category, ['bar'], 'remove works');
    t.end();
  });
  test('removeCategory - not present', function(t) {
    var doc = new Document('mysource','mylayer','myid');
    doc.category = ['foo','bar'];
    doc.removeCategory('bing');
    t.deepEqual(doc.category, ['foo','bar'], 'remove works');
    t.end();
  });
};

module.exports.all = function (tape, common) {

  function test(name, testFunction) {
    return tape('category: ' + name, testFunction);
  }

  for( var testCase in module.exports.tests ){
    module.exports.tests[testCase](test, common);
  }
};
