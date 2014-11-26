
var tape = require('tape');
var common = {};

var tests = [
  require('./Document.js'),
  require('./admin.js'),
  require('./alpha3.js'),
  require('./centroid.js'),
  require('./gid.js'),
  require('./id.js'),
  require('./latlon.js'),
  require('./meta.js'),
  require('./name.js'),
  require('./polygon.js'),
  require('./type.js')
];

tests.map(function(t) {
  t.all(tape, common);
});