
var model = require('./util/model'),
    valid = require('./util/valid'),
    transform = require('./util/transform');

function Centroid(){

}

// latitude
Centroid.prototype.setLon = function( lon ){
  return model.set( 'lon' )
              .transform( transform.floatify(6) )
              .validate( valid.type('number') )
              .validate( valid.geo('longitude') )
              .call( this, lon );
};
Centroid.prototype.getLon = model.get( 'lon' );

// longitude
Centroid.prototype.setLat = function( lat ){
  return model.set( 'lat' )
              .transform( transform.floatify(6) )
              .validate( valid.type('number') )
              .validate( valid.geo('latitude') )
              .call( this, lat );
};
Centroid.prototype.getLat = model.get( 'lat' );

// export
module.exports = Centroid;