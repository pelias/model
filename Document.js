
var pkg = require('./package'),
    model = require('./util/model'),
    valid = require('./util/valid'),
    transform = require('./util/transform');

function Document( type, id ){
  this.name = {};
  this.address = {};
  this.center_point = {};
  this.category = [];

  // create a non-enumerable property for metadata
  Object.defineProperty( this, '_meta', { writable: true, value: {} });
  this._meta.version = pkg.version;

  // mandatory properties
  this.setId( id );
  this.setType( type );
}

// id
Document.prototype.setId = function( id ){
  return model.setChild( '_meta' )
              .transform( transform.stringify() )
              .validate( valid.type('string') )
              .validate( valid.truthy() )
              .call( this, 'id', id );
};
Document.prototype.getId = function(){
  return model.getChild( '_meta' )
              .call( this, 'id' );
};

// type
Document.prototype.setType = function( type ){
  return model.setChild( '_meta' )
              .validate( valid.type('string') )
              .validate( valid.truthy() )
              .call( this, 'type', type );
};
Document.prototype.getType = function(){
  return model.getChild( '_meta' )
              .call( this, 'type' );
};

// alpha3
Document.prototype.setAlpha3 = model.set( 'alpha3' )
                                    .transform( transform.uppercase() )
                                    .validate( valid.type('string') )
                                    .validate( valid.truthy() )
                                    .validate( valid.length(3) );


Document.prototype.getAlpha3 = model.get( 'alpha3' );

// globally unique id
Document.prototype.getGid = function(){
  return this.getId() + ':' + this.getType();
};

// meta
Document.prototype.setMeta = model.setChild( '_meta' );
Document.prototype.getMeta = model.getChild( '_meta' );
Document.prototype.hasMeta = model.hasChild( '_meta' );
Document.prototype.delMeta = model.delChild( '_meta' );

// names
Document.prototype.setName = model.setChild( 'name' )
                                  .validate( valid.type('string') )
                                  .validate( valid.truthy() );

Document.prototype.getName = model.getChild( 'name' );
Document.prototype.hasName = model.hasChild( 'name' );
Document.prototype.delName = model.delChild( 'name' );

// address
Document.prototype.setAddress = function ( prop, val ){
  return model.setChild( 'address' )
    .validate( valid.property( Document.addressFields ) )
    .validate( valid.type('string') )
    .validate( valid.truthy() )
    .call( this, prop, val );
};

Document.prototype.getAddress = function ( prop ){
  return this.address[ prop ];
};

Document.prototype.delAddress = function ( prop ){
  delete this.address[ prop ];
};

Document.prototype.hasAddress = model.hasChild( 'address' );

// population
Document.prototype.setPopulation = model.set( 'population', null, null )
                                        .validate( valid.type('number') )
                                        .validate( valid.positive() );

Document.prototype.getPopulation = model.get( 'population' );

// popularity
Document.prototype.setPopularity = model.set( 'popularity', null, null )
                                        .transform( transform.roundify() )
                                        .validate( valid.type('number') )
                                        .validate( valid.positive() );

Document.prototype.getPopularity = model.get( 'popularity' );

// admin
Document.prototype.setAdmin = function( prop, val ){
  return model.set( prop )
              .validate( valid.property( Document.adminFields ) )
              .validate( valid.type('string') )
              .validate( valid.truthy() )
              .call( this, val );
};

Document.prototype.delAdmin = function ( prop ){
  delete this[ prop ];
};

Document.prototype.getAdmin = function( prop ){
  return model.get( prop ).call( this );
};

// latitude
Document.prototype.setLon = function( lon ){
  return model.setChild( 'center_point' )
              .transform( transform.floatify(6) )
              .validate( valid.type('number') )
              .validate( valid.geo('longitude') )
              .call( this, 'lon', lon );
};
Document.prototype.getLon = function(){
  return model.getChild( 'center_point' ).call( this, 'lon' );
};

// longitude
Document.prototype.setLat = function( lat ){
  return model.setChild( 'center_point' )
              .transform( transform.floatify(6) )
              .validate( valid.type('number') )
              .validate( valid.geo('latitude') )
              .call( this, 'lat', lat );
};
Document.prototype.getLat = function(){
  return model.getChild( 'center_point' ).call( this, 'lat' );
};

// categories
Document.prototype.addCategory = model.push( 'category' )
                                  .transform( transform.lowercase() )
                                  .validate( valid.type('string') )
                                  .validate( valid.truthy() );


Document.prototype.removeCategory = model.splice( 'category' );

// centroid
Document.prototype.setCentroid = function( centroid ){
  centroid = centroid || {};
  this.setLon.call( this, centroid.lon );
  this.setLat.call( this, centroid.lat );
  return this;
};
Document.prototype.getCentroid = model.get( 'center_point' );

// boundaries
Document.prototype.setPolygon = model.set( 'boundaries' )
                                     .validate( valid.type('object') )
                                     .validate( valid.truthy() );

Document.prototype.getPolygon = model.get( 'boundaries' );

// bounding box
Document.prototype.setBoundingBox = model.set( 'bounding_box' )
                                         .validate( valid.type('object') )
                                         .validate( valid.boundingBox() );
Document.prototype.getBoundingBox = model.get( 'bounding_box' );

// admin fields whitelist
Document.adminFields = ['admin0','admin1','admin1_abbr','admin2','local_admin','locality','neighborhood'];

Document.addressFields = ['name', 'number', 'street', 'zip'];

// export
module.exports = Document;
