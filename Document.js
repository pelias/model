
var pkg = require('./package'),
    model = require('./util/model'),
    valid = require('./util/valid'),
    transform = require('./util/transform');

function Document( type, id ){
  this.name = {};
  this.center_point = {};

  // create a non-enumerable property for metadata
  Object.defineProperty( this, '_meta', { writable: true, value: {} });
  this._meta.version = pkg.version;

  // mandatory properties
  this.setId( id );
  this.setType( type );
}

// id
Document.prototype.setId = function( id ){
  return model
          .setChild( '_meta', [ valid.type('string'), valid.truthy() ], [ transform.stringify() ] )
          .call( this, 'id', id );
};
Document.prototype.getId = function(){
  return model.getChild( '_meta' ).call( this, 'id' );
};

// type
Document.prototype.setType = function( type ){
  return model
          .setChild( '_meta', [ valid.type('string'), valid.truthy() ] )
          .call( this, 'type', type );
};
Document.prototype.getType = function(){
  return model.getChild( '_meta' ).call( this, 'type' );
};

// alpha3
Document.prototype.setAlpha3 = model.set( 'alpha3', [ valid.type('string'), valid.truthy(), valid.length(3) ], [ transform.uppercase() ] );
Document.prototype.getAlpha3 = model.get( 'alpha3' );

// globally unique id
Document.prototype.getGid = function(){
  return this.getId() + ':' + this.getType();
};

// meta
Document.prototype.setMeta = model.setChild( '_meta', [] );
Document.prototype.getMeta = model.getChild( '_meta' );
Document.prototype.hasMeta = model.hasChild( '_meta' );
Document.prototype.delMeta = model.delChild( '_meta' );

// names
Document.prototype.setName = model.setChild( 'name', [ valid.type('string'), valid.truthy() ] );
Document.prototype.getName = model.getChild( 'name' );
Document.prototype.hasName = model.hasChild( 'name' );
Document.prototype.delName = model.delChild( 'name' );

// admin
Document.adminFields = ['admin0','admin1','admin1_abbr','admin2','local_admin','locality','neighborhood'];
Document.prototype.setAdmin = function( prop, val ){
  if( -1 === Document.adminFields.indexOf( prop ) ){
    throw new Error( 'invalid admin field: ' + prop + ', should be one of: ' + Document.adminFields.join(',') );
  }
  return model.set( prop, [ valid.type('string'), valid.truthy() ] ).call( this, val );
};
Document.prototype.getAdmin = function( prop ){
  if( -1 === Document.adminFields.indexOf( prop ) ){
    throw new Error( 'invalid admin field: ' + prop + ', should be one of: ' + Document.adminFields.join(',') );
  }
  return model.get( prop, [ valid.type('string'), valid.truthy() ] ).call( this );
};

// latitude
Document.prototype.setLon = function( lon ){
  return model
          .setChild( 'center_point', [ valid.type('number'), valid.geo('longitude') ], [ transform.floatify(6) ] )
          .call( this, 'lon', lon );
};
Document.prototype.getLon = function(){
  return model.getChild( 'center_point' ).call( this, 'lon' );
};

// longitude
Document.prototype.setLat = function( lat ){
  return model
          .setChild( 'center_point', [ valid.type('number'), valid.geo('latitude') ], [ transform.floatify(6) ] )
          .call( this, 'lat', lat );
};
Document.prototype.getLat = function(){
  return model.getChild( 'center_point' ).call( this, 'lat' );
};

// centroid
Document.prototype.setCentroid = function( lon, lat ){
  this.setLon.call( this, lon );
  this.setLat.call( this, lat );
  return this;
};
Document.prototype.getCentroid = model.get( 'center_point' );

// boundaries
Document.prototype.setPolygon = model.set( 'boundaries', [ valid.type('object'), valid.truthy() ] );
Document.prototype.getPolygon = model.get( 'boundaries' );

module.exports = Document;