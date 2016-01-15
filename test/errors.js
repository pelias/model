
var errors = require('../errors');

module.exports.tests = {};

module.exports.tests.exports = function(test) {
  test('valid exports', function(t) {
    t.equal(typeof errors.PeliasModelError, 'function', 'error exported');
    t.end();
  });
};

module.exports.tests.pelias_model_error = function(test) {
  test('PeliasModelError', function(t) {

    // instantiate
    var e = new errors.PeliasModelError('fire!!!');
    t.true( e instanceof Error, 'valid Error object' );

    // distinguish from generic errors
    try { throw e; }
    catch (c) {
      switch( c.name ){
        case 'PeliasModelError':
          t.pass();
          break;
        default:
          t.fail();
      }
    }

    t.end();
  });
};

module.exports.all = function (tape, common) {

  function test(name, testFunction) {
    return tape('errors: ' + name, testFunction);
  }

  for( var testCase in module.exports.tests ){
    module.exports.tests[testCase](test, common);
  }
};
