var model = require('../../util/model'),
    valid = require('../../util/valid'),
    transform = require('../../util/transform');

module.exports.tests = {};

module.exports.tests.interface = function(test) {
  test('valid interface', function(t) {

    // root level accessors
    t.equal(typeof model.get, 'function', 'get() is a function');
    t.equal(typeof model.set, 'function', 'set() is a function');

    // second level accessors
    t.equal(typeof model.getChild, 'function', 'getChild() is a function');
    t.equal(typeof model.hasChild, 'function', 'hasChild() is a function');
    t.equal(typeof model.setChild, 'function', 'setChild() is a function');
    t.equal(typeof model.delChild, 'function', 'delChild() is a function');

    // root level array accessors
    t.equal(typeof model.push, 'function', 'push() is a function');
    t.equal(typeof model.splice, 'function', 'splice() is a function');

    t.end();
  });
};

module.exports.tests.get = function(test) {
  test('get()', function(t) {

    // invalid prop
    t.throws( model.get.bind(null, null), /invalid property/ );

    // getter
    var get = model.get('myKey');
    t.equal( typeof get, 'function', 'returns function' );
    t.equal( get.length, 0, 'returns function' );

    // inheritance
    var obj = { foo: 'bar' };
    obj.getFoo = model.get('foo');
    t.equal( obj.getFoo(), 'bar', 'gets value from object' );

    t.end();
  });
};

module.exports.tests.set = function(test) {
  test('set()', function(t) {

    // invalid prop
    t.throws( model.set.bind(null, null), /invalid property/ );

    // setter
    var set = model.set('myKey');
    t.equal( typeof set, 'function', 'returns function' );
    t.equal( set.length, 1, 'returns function' );

    // inheritance
    var obj = {};
    obj.setFoo = model.set('foo');
    var chain = obj.setFoo('bar');
    t.equal( obj.foo, 'bar', 'sets value on object' );
    t.equal( chain, obj, 'methods chainable' );

    // validators
    obj.setFoo = model.set('foo', [ valid.length(2) ]);
    t.throws( obj.setFoo.bind(null, 'b') );

    // transforms
    obj.setFoo = model.set('foo', null, [ transform.uppercase() ]);
    obj.setFoo('bong');
    t.equal( obj.foo, 'BONG', 'runs transforms before setting value' );

    // post validation transforms
    obj.setFoo = model.set('foo', null, null, [ transform.uppercase() ]);
    obj.setFoo('bong');
    t.equal( obj.foo, 'BONG', 'runs transforms before setting value' );

    t.end();
  });
};

module.exports.tests.getChild = function(test) {
  test('getChild()', function(t) {

    // invalid props
    t.throws( model.getChild.bind(null, null), /invalid child/ );
    t.throws( function(){ model.getChild('test')(); }, /invalid property/ );

    // getter
    var get = model.getChild('myKey');
    t.equal( typeof get, 'function', 'returns function' );
    t.equal( get.length, 1, 'returns function' );

    // get on non-object
    var invalid = { foo: 'string' };
    invalid.getChildFoo = model.getChild('foo');
    t.throws( function(){ invalid.getChildFoo('bing'); }, /invalid child/ );

    // inheritance
    var obj = { foo: { bing: 'bong' } };
    obj.getChildFoo = model.getChild('foo');
    t.equal( obj.getChildFoo('bing'), 'bong', 'gets value from child object' );

    t.end();
  });
};

module.exports.tests.hasChild = function(test) {
  test('hasChild()', function(t) {

    // invalid props
    t.throws( model.hasChild.bind(null, null), /invalid child/ );
    t.throws( function(){ model.hasChild('test')(); }, /invalid property/ );

    // hasser
    var has = model.hasChild('myKey');
    t.equal( typeof has, 'function', 'returns function' );
    t.equal( has.length, 1, 'returns function' );

    // has on non-object
    var invalid = { foo: 'string' };
    invalid.hasChildFoo = model.hasChild('foo');
    t.throws( function(){ invalid.hasChildFoo('bing'); }, /invalid child/ );

    // inheritance
    var obj = { foo: { bing: 'bong' } };
    obj.hasChildFoo = model.hasChild('foo');
    t.true( obj.hasChildFoo('bing'), 'returns true if present' );
    t.false( obj.hasChildFoo('not'), 'returns false if not present' );

    t.end();
  });
};

module.exports.tests.setChild = function(test) {
  test('setChild()', function(t) {

    // invalid props
    t.throws( model.setChild.bind(null, null), /invalid child/ );
    t.throws( function(){ model.setChild('test')(); }, /invalid property/ );

    // setter
    var set = model.setChild('myKey');
    t.equal( typeof set, 'function', 'returns function' );
    t.equal( set.length, 2, 'returns function' );

    // set on non-object
    var invalid = { foo: 'string' };
    invalid.setChildFoo = model.setChild('foo');
    t.throws( function(){ invalid.setChildFoo('bing','bong'); }, /invalid child/ );

    // inheritance
    var obj = { foo: {} };
    obj.setChildFoo = model.setChild('foo');
    var chain = obj.setChildFoo('bing','bong');
    t.equal( obj.foo.bing, 'bong', 'sets value on child object' );
    t.equal( chain, obj, 'methods chainable' );

    // validators
    obj.setChildFoo = model.setChild('foo', [ valid.length(2) ]);
    t.throws( obj.setChildFoo.bind(null, 'b') );

    // transforms
    obj.setChildFoo = model.setChild('foo', null, [ transform.uppercase() ]);
    obj.setChildFoo('bing','bong');
    t.equal( obj.foo.bing, 'BONG', 'runs transforms before setting value' );

    t.end();
  });
};

module.exports.tests.delChild = function(test) {
  test('delChild()', function(t) {

    // invalid props
    t.throws( model.delChild.bind(null, null), /invalid child/ );
    t.throws( function(){ model.delChild('test')(); }, /invalid property/ );

    // hasser
    var has = model.delChild('myKey');
    t.equal( typeof has, 'function', 'returns function' );
    t.equal( has.length, 1, 'returns function' );

    // has on non-object
    var invalid = { foo: 'string' };
    invalid.delChildFoo = model.delChild('foo');
    t.throws( function(){ invalid.delChildFoo('bing'); }, /invalid child/ );

    // inheritance
    var obj = { foo: { bing: 'bong' } };
    obj.delChildFoo = model.delChild('foo');
    t.true( obj.delChildFoo('bing'), 'returns true if present' );
    t.false( obj.delChildFoo('not'), 'returns false if not present' );

    t.end();
  });
};

module.exports.tests.push = function(test) {
  test('push()', function(t) {

    // invalid prop
    t.throws( model.push.bind(null, null), /invalid property/ );

    // pusher
    var push = model.push('myKey');
    t.equal( typeof push, 'function', 'returns function' );
    t.equal( push.length, 1, 'returns function' );

    // push on non-array
    var invalid = { foo: 'string' };
    invalid.pushFoo = model.push('foo');
    t.throws( function(){ invalid.pushFoo('item1'); }, /invalid child/ );

    // inheritance
    var obj = { foo: [] };
    obj.pushFoo = model.push('foo');
    var chain = obj.pushFoo('bar');
    t.deepEqual( obj.foo, ['bar'], 'add value to set' );
    t.equal( chain, obj, 'methods chainable' );

    // validators
    obj.pushFoo = model.push('foo', [ valid.length(2) ]);
    t.throws( obj.pushFoo.bind(null, 'b') );

    // transforms
    obj.pushFoo = model.push('foo', null, [ transform.uppercase() ]);
    obj.pushFoo('bong');
    t.deepEqual( obj.foo, ['bar','BONG'], 'runs transforms before pushing value' );

    t.end();
  });
};

module.exports.tests.splice = function(test) {
  test('splice()', function(t) {

    // invalid prop
    t.throws( model.splice.bind(null, null), /invalid property/ );

    // splicer
    var splice = model.splice('myKey');
    t.equal( typeof splice, 'function', 'returns function' );
    t.equal( splice.length, 1, 'returns function' );

    // splice on non-array
    var invalid = { foo: 'string' };
    invalid.spliceFoo = model.splice('foo');
    t.throws( function(){ invalid.spliceFoo('item1'); }, /invalid child/ );

    // inheritance
    var obj = { foo: ['bar','BONG'] };
    obj.spliceFoo = model.splice('foo');
    var chain = obj.spliceFoo('BONG');
    t.deepEqual( obj.foo, ['bar'], 'remove value from set' );
    t.equal( chain, obj, 'methods chainable' );

    t.end();
  });
};

module.exports.tests.pushChild = function(test) {
  test('pushChild()', function(t) {

    // invalid prop
    t.throws( model.pushChild.bind(null, null), /invalid child/ );

    // pusher
    var push = model.pushChild('myKey');
    t.equal( typeof push, 'function', 'returns function' );
    t.equal( push.length, 2, 'returns function' );

    // push on non-array
    var invalid = { foo: { bar: 'string' } };
    invalid.pushChildFoo = model.pushChild('foo');
    t.throws( function(){ invalid.pushChildFoo('bar','item1'); }, /invalid child/ );

    // inheritance
    var obj = { foo: { baz: [] } };
    obj.pushChildFoo = model.pushChild('foo');
    var chain = obj.pushChildFoo('baz','item1');
    t.deepEqual( obj.foo.baz, ['item1'], 'add value to set' );
    t.equal( chain, obj, 'methods chainable' );

    // validators
    obj.pushChildFoo = model.pushChild('foo', [ valid.length(2) ]);
    t.throws( obj.pushChildFoo.bind(null, 'baz', 'b') );

    // transforms
    obj.pushChildFoo = model.pushChild('foo', null, [ transform.uppercase() ]);
    obj.pushChildFoo('baz','item2');
    t.deepEqual( obj.foo.baz, ['item1','ITEM2'], 'runs transforms before pushing value' );

    t.end();
  });
};

module.exports.tests.clearChild = function(test) {
  test('clearChild()', function(t) {
    // invalid prop
    t.throws( model.clearChild.bind(null, null), /invalid child/ );

    // clearer
    var clear = model.clearChild('myKey');
    t.equal( typeof clear, 'function', 'returns function' );
    t.equal( clear.length, 1, 'returns function' );

    // inheritance
    var obj = { foo: { baz: [1, 2] } };
    obj.clearChildFoo = model.clearChild('foo');
    var chain = obj.clearChildFoo('baz');
    t.deepEqual( obj.foo.baz, [], 'empty array' );
    t.equal( chain, obj, 'methods chainable' );

    t.end();

  });
};

module.exports.tests.spliceChild = function(test) {
  test('spliceChild()', function(t) {

    // invalid prop
    t.throws( model.spliceChild.bind(null, null), /invalid child/ );

    // splicer
    var splice = model.spliceChild('myKey');
    t.equal( typeof splice, 'function', 'returns function' );
    t.equal( splice.length, 2, 'returns function' );

    // splice on non-array
    var invalid = { foo: { bar: 'string' } };
    invalid.spliceChildFoo = model.spliceChild('foo');
    t.throws( function(){ invalid.spliceChildFoo('bar','item1'); }, /invalid child/ );

    // inheritance
    var obj = { foo: { bar: ['item1','ITEM2'] } };
    obj.spliceFoo = model.spliceChild('foo');
    var chain = obj.spliceFoo('bar','ITEM2');
    t.deepEqual( obj.foo.bar, ['item1'], 'remove value from set' );
    t.equal( chain, obj, 'methods chainable' );

    t.end();
  });
};

module.exports.all = function (tape, common) {

  function test(name, testFunction) {
    return tape('model: ' + name, testFunction);
  }

  for( var testCase in module.exports.tests ){
    module.exports.tests[testCase](test, common);
  }
};
