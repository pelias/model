
var Document = require('../Document');

module.exports.tests = {};

module.exports.tests.interface = function(test) {
  test('valid interface', function(t) {
    t.equal(typeof Document, 'function', 'Document is a function');

    t.equal(typeof Document.prototype.getId, 'function', 'getId() is a function');
    t.equal(typeof Document.prototype.setId, 'function', 'setId() is a function');

    t.equal(typeof Document.prototype.getType, 'function', 'getType() is a function');
    t.equal(typeof Document.prototype.setType, 'function', 'setType() is a function');

    t.equal(typeof Document.prototype.getSource, 'function', 'getSource() is a function');
    t.equal(typeof Document.prototype.setSource, 'function', 'setSource() is a function');

    t.equal(typeof Document.prototype.getLayer, 'function', 'getLayer() is a function');
    t.equal(typeof Document.prototype.setLayer, 'function', 'setLayer() is a function');

    t.end();
  });
};

module.exports.tests.constructor = function(test) {
  test('constructor args', function(t) {

    var doc = new Document('mysource','mylayer','myid');

    // initial values
    t.deepEqual(doc.name, {}, 'initial value');
    t.deepEqual(doc.address_parts, {}, 'initial value');
    t.deepEqual(doc.center_point, {}, 'initial value');
    t.true(Array.isArray(doc.category), 'initial value');
    t.true(doc.hasOwnProperty('_meta'), 'initial value');
    t.true(doc._meta.hasOwnProperty('version'), 'initial value');

    // initialize 'parent' fields to empty arrays
    t.equal(typeof doc.parent, 'object', 'initial value');
    Document.parentFields.forEach( function(field){
      t.true(Array.isArray(doc.parent[field]), 'initial value');
    });

    // setters called
    t.equal(doc.source, 'mysource', 'setter called');
    t.equal(doc.layer, 'mylayer', 'setter called');
    t.equal(doc.source_id, 'myid', 'setter called');
    t.equal(doc._meta.id, 'myid', 'setter called');
    t.equal(doc._meta.type, 'mylayer', 'setter called');

    t.end();
  });
};

module.exports.tests.clearParent = function(test) {
  test('clearParent should remove all effects of addParent calls', function(t) {
    var doc = new Document('mysource','mylayer','myid');
    doc.addParent('locality', 'name 1', 'id 1', 'abbr 1');
    doc.addParent('locality', 'name 2', 'id 2', 'abbr 2');

    t.deepEqual(doc.parent.locality, ['name 1', 'name 2'], 'should be empty');
    t.deepEqual(doc.parent.locality_id, ['id 1', 'id 2'], 'should be empty');
    t.deepEqual(doc.parent.locality_a, ['abbr 1', 'abbr 2'], 'should be empty');

    doc.clearParent('locality');

    t.deepEqual(doc.parent.locality, [], 'should be empty');
    t.deepEqual(doc.parent.locality_id, [], 'should be empty');
    t.deepEqual(doc.parent.locality_a, [], 'should be empty');

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
