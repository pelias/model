
var Document = require('../../Document');
var intersections = require('../../post/intersections');

module.exports.tests = {};

module.exports.tests.functional = function(test) {
  test('functional', function(t) {
    var doc = new Document('mysource','intersection','myid');
    
    // street and cross_street not set
    intersections(doc);
    t.deepEqual(doc.getNameAliases('default'), [], 'no names set');

    // set street
    doc.setAddress('street', 'Example Street');

    // street set, cross_street not set
    intersections(doc);
    t.deepEqual(doc.getNameAliases('default'), [], 'no names set');

    // set cross_street
    doc.setAddress('cross_street', 'Cross Street');

    // street and cross_street set
    intersections(doc);

    // intersection aliases defined
    t.deepEqual(doc.getNameAliases('default'), [
      'Example Street & Cross Street',
      'Example Street @ Cross Street',
      'Example Street at Cross Street',
      'Corner of Example Street & Cross Street',
      'Cross Street & Example Street',
      'Cross Street @ Example Street',
      'Cross Street at Example Street',
      'Corner of Cross Street & Example Street'
    ]);

    t.end();
  });
};

module.exports.all = function (tape, common) {

  function test(name, testFunction) {
    return tape('post/intersections: ' + name, testFunction);
  }

  for( var testCase in module.exports.tests ){
    module.exports.tests[testCase](test, common);
  }
};
