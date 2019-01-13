
const Document = require('../../Document');
const intersections = require('../../post/intersections');
const DEFAULT_SCRIPTS = [ intersections ];

module.exports.tests = {};

module.exports.tests.addPostProcessingScript = function(test) {
  test('default scripts', function(t) {
    let doc = new Document('mysource','mylayer','myid');
    t.deepEqual(doc._post, DEFAULT_SCRIPTS, 'default processing scripts');
    t.end();
  });
  test('invalid type', function(t) {
    let doc = new Document('mysource','mylayer','myid');
    t.throws( doc.addPostProcessingScript.bind(doc, 'invalid'), /invalid document type, expecting: function got/ );
    t.throws( doc.addPostProcessingScript.bind(doc, 100), /invalid document type, expecting: function got/ );
    t.throws( doc.addPostProcessingScript.bind(doc, []), /invalid document type, expecting: function got/ );
    t.throws( doc.addPostProcessingScript.bind(doc, {}), /invalid document type, expecting: function got/ );
    t.end();
  });
  test('set function', function(t) {
    let script = function(){};
    let doc = new Document('mysource','mylayer','myid');
    doc.addPostProcessingScript( script );
    t.deepEqual(doc._post, DEFAULT_SCRIPTS.concat( script ), 'default processing scripts');
    t.end();
  });
  test('set same function twice (allowed)', function(t) {
    let script = function(){};
    let doc = new Document('mysource','mylayer','myid');
    doc.addPostProcessingScript( script );
    doc.addPostProcessingScript( script );
    t.deepEqual(doc._post, DEFAULT_SCRIPTS.concat( script, script ), 'default processing scripts');
    t.end();
  });
};

module.exports.tests.removePostProcessingScript = function(test) {
  test('invalid type', function(t) {
    let doc = new Document('mysource','mylayer','myid');
    t.throws( doc.removePostProcessingScript.bind(doc, 'invalid'), /invalid document type, expecting: function got/ );
    t.throws( doc.removePostProcessingScript.bind(doc, 100), /invalid document type, expecting: function got/ );
    t.throws( doc.removePostProcessingScript.bind(doc, []), /invalid document type, expecting: function got/ );
    t.throws( doc.removePostProcessingScript.bind(doc, {}), /invalid document type, expecting: function got/ );
    t.end();
  });
  test('remove function', function(t) {
    let script = function(){};
    let doc = new Document('mysource','mylayer','myid');
    doc._post = [ script ];
    doc.removePostProcessingScript( script );
    t.deepEqual(doc._post, [], 'script removed');
    doc.removePostProcessingScript( script );
    t.deepEqual(doc._post, [], 'no-op');
    t.end();
  });
  test('remove duplicate functions (allowed)', function(t) {
    let script = function(){};
    let doc = new Document('mysource','mylayer','myid');
    doc._post = [ script, script ];
    doc.removePostProcessingScript( script );
    t.deepEqual(doc._post, [], 'scripts removed');
    doc.removePostProcessingScript( script );
    t.deepEqual(doc._post, [], 'no-op');
    t.end();
  });
};

module.exports.tests.callPostProcessingScript = function(test) {
  test('call all scripts', function(t) {
    let doc = new Document('mysource','mylayer','myid');
    doc._post = []; // remove any default scripts
    t.plan(3);

    // document pointer passed as first arg to scripts
    doc.addPostProcessingScript((ref) => t.equal(doc, ref));
    doc.addPostProcessingScript((ref) => t.equal(doc, ref));
    doc.addPostProcessingScript((ref) => t.equal(doc, ref));

    // call all scripts
    doc.callPostProcessingScripts();
  });
};

module.exports.all = function (tape, common) {

  function test(name, testFunction) {
    return tape('post processing: ' + name, testFunction);
  }

  for( let testCase in module.exports.tests ){
    module.exports.tests[testCase](test, common);
  }
};
