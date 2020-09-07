
var Document = require('../Document');
var fixtures = require('./serialize/fixtures');
var iterations = 10000;

// return the amount of milliseconds since 01 jan 1970
function now(){ return (new Date()).getTime(); }

var start = now();
for( var x=0; x<iterations; x++ ){

  // create a new doc and serialize it
  new Document( 'geoname', 'venue', 1003 )
    .setMeta( 'author', 'peter' )
    .setName( 'default', 'Hackney City Farm' )
    .setName( 'alt', 'Haggerston City Farm' )
    .addParent( 'country', 'Great Britain', '1001', 'GreatB' )
    .addParent( 'neighbourhood', 'Shoreditch', '2002' )
    .setAddress( 'number', '10' )
    .setAddress( 'street', 'pelias place' )
    .addCategory( 'foo' )
    .addCategory( 'bar' )
    .removeCategory( 'foo' )
    .setPopulation(10)
    .setPopularity(3)
    .setCentroid({ lon: 0.5, lat: 50.1 })
    .setShape(fixtures.new_zealand)
    .setBoundingBox(fixtures.new_zealand_bbox)
    .toESDocument();
}
var end = now();

var took = end - start;
console.error( 'imported', iterations, 'docs in', took, 'ms');
console.error( 'average speed:', (took / iterations).toFixed(4), 'ms' );
