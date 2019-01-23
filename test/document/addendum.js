const Document = require('../../Document');
module.exports.tests = {};

const fixture = {
  wikipedia: { slug: 'Wikipedia', population: 100 },
  custom: { example: [ 'Example' ] }
};

module.exports.tests.getAddendum = function(test) {
  test('getAddendum', function(t) {
    var doc = new Document('mysource','mylayer','myid');
    t.equal(doc.getAddendum('wikipedia'), undefined, 'getter works');
    doc.addendum = fixture;
    t.equal(doc.getAddendum('wikipedia'), fixture.wikipedia, 'getter works');
    t.end();
  });
};

module.exports.tests.setAddendum = function(test) {
  test('setAddendum', function(t) {
    var doc = new Document('mysource','mylayer','myid');
    t.equal(doc.setAddendum('wikipedia',fixture.wikipedia), doc, 'chainable');
    t.equal(doc.addendum.wikipedia, fixture.wikipedia, 'setter works');
    t.end();
  });
  test('setAddendum - validate namespace', function(t) {
    var doc = new Document('mysource','mylayer','myid');
    t.throws( doc.setAddendum.bind(doc,1,fixture), null, 'invalid type' );
    t.throws( doc.setAddendum.bind(doc,'',fixture), null, 'invalid length' );
    t.throws( doc.setAddendum.bind(doc,' ',fixture), null, 'invalid length' );
    t.throws( doc.setAddendum.bind(doc,null,fixture), null, 'invalid length' );
    t.equal(doc.getAddendum('test'), undefined, 'property not set');
    t.end();
  });
  test('setAddendum - validate val', function(t) {
    var doc = new Document('mysource','mylayer','myid');
    t.throws( doc.setAddendum.bind(doc,'wikipedia',1), null, 'invalid value' );
    t.throws( doc.setAddendum.bind(doc,'wikipedia',''), null, 'invalid value' );
    t.throws( doc.setAddendum.bind(doc,'wikipedia',' '), null, 'invalid value' );
    t.throws( doc.setAddendum.bind(doc,'wikipedia',null), null, 'invalid value' );
    t.throws( doc.setAddendum.bind(doc,'wikipedia','\t'), null, 'invalid value' );
    t.equal(doc.getAddendum('test'), undefined, 'property not set');
    t.end();
  });
};

module.exports.tests.hasAddendum = function(test) {
  test('hasAddendum', function(t) {
    var doc = new Document('mysource','mylayer','myid');
    t.equal(doc.hasAddendum('wikipedia'), false, 'hasser works');
    doc.addendum = fixture;
    t.equal(doc.hasAddendum('wikipedia'), true, 'hasser works');
    t.end();
  });
};

module.exports.tests.delAddendum = function(test) {
  test('delAddendum', function(t) {
    var doc = new Document('mysource','mylayer','myid');
    t.equal(doc.delAddendum('wikipedia'), false, 'deller works');
    doc.addendum = fixture;
    t.equal(doc.delAddendum('wikipedia'), true, 'deller works');
    t.equal(doc.addendum.wikipedia, undefined, 'deller works');
    t.end();
  });
};

module.exports.all = function (tape, common) {

  function test(name, testFunction) {
    return tape('addendum: ' + name, testFunction);
  }

  for( var testCase in module.exports.tests ){
    module.exports.tests[testCase](test, common);
  }
};