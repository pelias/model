
var Document = require('../index').Document;

var poi = new Document( 'geoname', 1003 )
  .setAlpha3( 'GBR' )
  .setMeta( 'author', 'peter' )
  .setMeta( 'date', new Date().getTime() )
  .setName( 'default', 'Hackney City Farm' )
  .setName( 'alt', 'Haggerston City Farm' )
  .setAdmin( 'admin0', 'Great Britain' )
  .setAdmin( 'neighborhood', 'Shoreditch' )
  .setPopulation(1000)
  .setPopularity(10)
  .setCentroid({ lon: 0.5, lat: 50.1 });

console.log( poi );
console.log( poi._meta );
console.log( JSON.stringify( poi, null, 2 ) );