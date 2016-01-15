
var pkg = require('./package'),
    model = require('./util/model'),
    valid = require('./util/valid'),
    transform = require('./util/transform'),
    _ = require('lodash');

function Document( source, layer, source_id ){
  this.name = {};
  this.parent = {};
  this.address = {};
  this.center_point = {};
  this.category = [];

  // initialize 'parent' fields to empty arrays
  Document.parentFields.forEach( function(field){
    this.parent[field] = [];
  }, this);

  // create a non-enumerable property for metadata
  Object.defineProperty( this, '_meta', { writable: true, value: {} });
  this._meta.version = pkg.version;

  // mandatory properties
  this.setSource( source );
  this.setLayer( layer );
  this.setSourceId( source_id );
  this.setId( source_id );

  // set the elasticsearch '_type' property to be the same as $layer
  // this may be removed/modified in the future if required but will mean
  // that; for example; all 'address' data ends up in the same '_type', even
  // if it comes from different sources.
  this.setType( layer );
}

Document.prototype.toJSON = function(){
  this.phrase = this.name;
  return this;
};

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

// source
Document.prototype.setSource = model.set( 'source' )
                                    .transform( transform.lowercase() )
                                    .validate( valid.type('string') )
                                    .validate( valid.truthy() );

Document.prototype.getSource = model.get( 'source' );

// layer
Document.prototype.setLayer = model.set( 'layer' )
                                    .transform( transform.lowercase() )
                                    .validate( valid.type('string') )
                                    .validate( valid.truthy() );

Document.prototype.getLayer = model.get( 'layer' );

// source
Document.prototype.setSourceId = model.set( 'source_id' )
                                    .transform( transform.stringify() )
                                    .transform( transform.lowercase() )
                                    .validate( valid.type('string') )
                                    .validate( valid.truthy() );

Document.prototype.getSourceId = model.get( 'source_id' );

// alpha3
Document.prototype.setAlpha3 = model.set( 'alpha3' )
                                    .transform( transform.uppercase() )
                                    .validate( valid.type('string') )
                                    .validate( valid.truthy() )
                                    .validate( valid.length(3) );


Document.prototype.getAlpha3 = model.get( 'alpha3' );

// globally unique id
Document.prototype.getGid = function(){
  return [ this.getSource(), this.getLayer(), this.getId() ].join(':');
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

// parent
Document.prototype.addParent = model.pushChild( 'parent' )
                                  .validate( valid.type('string') )
                                  .validate( valid.truthy() );

Document.prototype.removeParent = model.spliceChild( 'parent' );

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

// shape
Document.prototype.setPolygon = model.set( 'shape' )
                                     .validate( valid.type('object') )
                                     .validate( valid.truthy() );

Document.prototype.getPolygon = model.get( 'shape' );

// bounding box
// verify that the supplied bounding_box is a well-formed object, finally
// marshaling into a ES-specific format
Document.prototype.setBoundingBox = model.set( 'bounding_box' )
                                         .validate( valid.type('object') )
                                         .validate( valid.boundingBox() )
                                         .postValidationTransform( transform.boundingBoxify() );

// marshal the internal bounding_box back into the representation the caller supplied
Document.prototype.getBoundingBox = function() {
  // if there is no bounding_box set, just return undefined
  if (_.isUndefined(this.bounding_box)) {
    return undefined;
  }

  var internalBoundingBox = this.bounding_box;

  return {
    upperLeft: {
      lat: internalBoundingBox.coordinates[0][1],
      lon: internalBoundingBox.coordinates[0][0]
    },
    lowerRight: {
      lat: internalBoundingBox.coordinates[1][1],
      lon: internalBoundingBox.coordinates[1][0]
    }
  };

};

// admin fields whitelist
Document.adminFields = ['admin0','admin1','admin1_abbr','admin2','local_admin','locality','neighborhood'];

Document.addressFields = ['name', 'number', 'street', 'zip'];

Document.parentFields = ['alpha3','country','country_abbr','country_id','region','region_abbr',
  'region_id','county','county_abbr','county_id','locality','locality_abbr','locality_id',
  'localadmin','localadmin_abbr','localadmin_id','neighbourhood','neighbourhood_abbr','neighbourhood_id'];

// export
module.exports = Document;
