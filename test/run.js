var tape = require('tape');
var common = {};

var tests = [
  require('./Document.js'),
  require('./errors.js'),
  require('./document/centroid.js'),
  require('./document/gid.js'),
  require('./document/id.js'),
  require('./document/meta.js'),
  require('./document/popularity.js'),
  require('./document/population.js'),
  require('./document/name.js'),
  require('./document/addendum.js'),
  require('./document/address.js'),
  require('./document/parent.js'),
  require('./document/polygon.js'),
  require('./document/type.js'),
  require('./document/category.js'),
  require('./document/boundingbox.js'),
  require('./document/source.js'),
  require('./document/layer.js'),
  require('./document/source_id.js'),
  require('./document/toESDocument.js'),
  require('./document/post.js'),
  require('./post/intersections.js'),
  require('./post/deduplication.js'),
  require('./DocumentMapperStream.js'),
  require('./util/transform.js'),
  require('./util/valid.js'),
  require('./serialize/test.js'),
];

tests.map(function(t) {
  t.all(tape, common);
});
