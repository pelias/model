
var Document = require('../Document');

var poi = new Document( 'geoname', 1003 )
  .setAlpha3( 'GBR' )
  .setMeta( 'author', 'peter' )
  .setMeta( 'date', new Date().getTime() )
  .setName( 'default', 'Hackney City Farm' )
  .setName( 'alt', 'Haggerston City Farm' )
  .setAdmin( 'admin0', 'Great Britain' )
  .setAdmin( 'neighborhood', 'Shoreditch' )
  .setCentroid( 0.5, 50.1 );

console.log( poi );
console.log( poi._meta );
console.log( JSON.stringify( poi, null, 2 ) );