
var Document = require('../../Document');

module.exports.tests = {};

module.exports.tests.getAdmin = function(test) {
  Document.adminFields.forEach( function( field ){
    test('getAdmin - ' + field, function(t) {
      var doc = new Document('mysource','mylayer','myid');
      doc[field] = 'foo';
      t.equal(doc.getAdmin(field), 'foo', 'getter works');
      t.end();
    });
  });
};

module.exports.tests.setAdmin = function(test) {
  Document.adminFields.forEach( function( field ){
    test('setAdmin - ' + field, function(t) {
      var doc = new Document('mysource','mylayer','myid');
      t.equal(doc[field], undefined, 'id undefined');
      t.equal(doc.setAdmin(field,'foo'), doc, 'chainable');
      t.equal(doc[field], 'foo', 'id set');
      t.end();
    });
  });
  Document.adminFields.forEach( function( field ){
    test('setAdmin - ' + field + ' - validate', function(t) {
      var doc = new Document('mysource','mylayer','myid');
      t.throws( doc.setAdmin.bind(doc,field,undefined), null, 'invalid type' );
      t.throws( doc.setAdmin.bind(doc,field,''), null, 'invalid length' );
      t.throws( doc.setAdmin.bind(doc,field,' '), null, 'invalid length' );
      t.end();
    });
  });
};

module.exports.all = function (tape, common) {

  function test(name, testFunction) {
    return tape('admin: ' + name, testFunction);
  }

  for( var testCase in module.exports.tests ){
    module.exports.tests[testCase](test, common);
  }
};
