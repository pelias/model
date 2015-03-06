
var tape = require('tape');
var common = {};

var tests = [
  require('./Document.js'),
  require('./document/admin.js'),
  require('./document/alpha3.js'),
  require('./document/centroid.js'),
  require('./document/gid.js'),
  require('./document/id.js'),
  require('./document/latlon.js'),
  require('./document/meta.js'),
  require('./document/popularity.js'),
  require('./document/population.js'),
  require('./document/name.js'),
  require('./document/address.js'),
  require('./document/polygon.js'),
  require('./document/type.js')
];

tests.map(function(t) {
  t.all(tape, common);
});