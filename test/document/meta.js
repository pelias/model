
var Document = require('../../Document');

module.exports.tests = {};

module.exports.tests.getMeta = function(test) {
  test('getMeta', function(t) {
    var doc = new Document('mysource','mylayer','myid');
    t.equal(doc.getMeta('foo'), undefined, 'getter works');
    doc._meta = { 'foo': 'bar' };
    t.equal(doc.getMeta('foo'), 'bar', 'getter works');
    t.end();
  });
};

module.exports.tests.setMeta = function(test) {
  test('setMeta', function(t) {
    var doc = new Document('mysource','mylayer','myid');
    t.equal(doc.setMeta('foo','bar'), doc, 'chainable');
    t.equal(doc._meta.foo, 'bar', 'setter works');
    t.end();
  });
};

module.exports.tests.hasMeta = function(test) {
  test('hasMeta', function(t) {
    var doc = new Document('mysource','mylayer','myid');
    t.equal(doc.hasMeta('foo'), false, 'hasser works');
    doc._meta.foo = 'bar';
    t.equal(doc.hasMeta('foo'), true, 'hasser works');
    t.end();
  });
};

module.exports.tests.delMeta = function(test) {
  test('delMeta', function(t) {
    var doc = new Document('mysource','mylayer','myid');
    t.equal(doc.delMeta('foo'), false, 'deller works');
    doc._meta.foo = 'bar';
    t.equal(doc.delMeta('foo'), true, 'deller works');
    t.equal(doc._meta.foo, undefined, 'deller works');
    t.end();
  });
};

module.exports.all = function (tape, common) {

  function test(name, testFunction) {
    return tape('meta: ' + name, testFunction);
  }

  for( var testCase in module.exports.tests ){
    module.exports.tests[testCase](test, common);
  }
};
