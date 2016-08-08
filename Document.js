var config = require('pelias-config').generate();

var pkg = require('./package');
var model = require('./util/model');
var valid = require('./util/valid');
var transform = require('./util/transform');
var _ = require('lodash');

function Document( source, layer, source_id ){
  this.name = {};
  this.phrase = {};
  this.parent = {};
  this.address_parts = {};
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
  return this;
};

/*
 * Returns an object in exactly the format that Elasticsearch wants for inserts
 */
Document.prototype.toESDocument = function() {
  return {
    _index: config.schema.indexName,
    _type: this.getType(),
    _id: this.getId(),
    data: JSON.parse( JSON.stringify( this, function( k, v ){
      if((_.isArray(v) || _.isPlainObject(v)) && _.isEmpty(v) ){
        return undefined;
      }
      return v;
    }))
  };
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
Document.prototype.setName = function(prop, value) {
  var setterFn = model.setChild( 'name' )
  .validate( valid.type('string') )
  .validate( valid.truthy() );

  setterFn.call(this, prop, value);

  this.phrase = this.name;

  return this;
};

Document.prototype.getName = model.getChild( 'name' );
Document.prototype.hasName = model.hasChild( 'name' );
Document.prototype.delName = model.delChild( 'name' );

// parent
Document.prototype.addParent = function( field, name, id, abbr ){
  var add = model.pushChild( 'parent' )
    .validate( valid.type('string') )
    .validate( valid.truthy() )
    .bind(this);

  // mandatory fields, eg: 'country', 'country_id'
  add( field, name );
  add( field + '_id', id );

  // optional field, eg: 'country_a', defaults to `null` for downstream ES
  /**
    note: the rationale for setting this field as 'null' instead of 'undefined'
    is so that each of the fields 'line-up'.

    == if you add a parent property with no abbreviation, as such:

    setParent( 'region', 'foobar', '1' )

    doc:
      parent.region       = [ 'foobar' ]
      parent.region_id    = [ '1' ]
      parent.region_a     = [ null ]

    == and then you add another parent property such as:

    setParent( 'region', 'bingobango', '2', 'bingo' )

    doc:
      parent.region       = [ 'foobar', 'bingobango' ]
      parent.region_id    = [ '1',      '2' ]
      parent.region_a     = [ null,     'bingo' ]

    == you can now be sure that the abbreviation 'bingo' belongs to '2' and not '1'.
  **/
  if (_.isUndefined(abbr)) {
    var addNull = model.pushChild( 'parent' ).bind(this);
    addNull( field + '_a', null );

  } else {
    add( field + '_a', abbr );
  }

  // chainable
  return this;
};

// clear all all added values
Document.prototype.clearParent = function(field) {
  var clear = model.clearChild( 'parent' ).bind(this);

  clear( field );
  clear( field + '_id' );
  clear( field + '_a' );

  return this;
};

// address
Document.prototype.setAddress = function ( prop, val ){
  return model.setChild( 'address_parts' )
    .validate( valid.property( Document.addressFields ) )
    .validate( valid.type('string') )
    .validate( valid.truthy() )
    .call( this, prop, val );
};

Document.prototype.getAddress = function ( prop ){
  return this.address_parts[ prop ];
};

Document.prototype.delAddress = function ( prop ){
  delete this.address_parts[ prop ];
};

Document.prototype.hasAddress = model.hasChild( 'address_parts' );

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
                                         .postValidationTransform( transform.toULLR() );

// marshal the internal bounding_box back into the representation the caller supplied
Document.prototype.getBoundingBox = model.get('bounding_box');

Document.addressFields = ['name', 'number', 'street', 'zip'];

Document.parentFields = [
  'country',       'country_a',       'country_id',
  'dependency',    'dependency_a',    'dependency_id',
  'macroregion',   'macroregion_a',   'macroregion_id',
  'region',        'region_a',        'region_id',
  'macrocounty',   'macrocounty_a',   'macrocounty_id',
  'county',        'county_a',        'county_id',
  'borough',       'borough_a',       'borough_id',
  'locality',      'locality_a',      'locality_id',
  'localadmin',    'localadmin_a',    'localadmin_id',
  'neighbourhood', 'neighbourhood_a', 'neighbourhood_id'
];

// export
module.exports = Document;
