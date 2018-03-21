var config = require('pelias-config').generate();

var validate = require('./util/valid');
var transform = require('./util/transform');
var _ = require('lodash');

const addressFields = ['name', 'number', 'unit', 'street', 'zip'];

const parentFields = [
  'continent',
  'country',
  'dependency',
  'macroregion',
  'region',
  'macrocounty',
  'county',
  'borough',
  'locality',
  'localadmin',
  'macrohood',
  'neighbourhood',
  'postalcode',
  'ocean',
  'marinearea',
  'empire'
];

function Document( source, layer, source_id ){
  this.name = {};
  this.phrase = {};
  this.parent = {};
  this.address_parts = {};
  this.center_point = {};
  this.category = [];

  // create a non-enumerable property for metadata
  Object.defineProperty( this, '_meta', { writable: true, value: {} });

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
  var doc = {
    name: this.name,
    phrase: this.phrase,
    parent: this.parent,
    address_parts: this.address_parts,
    center_point: this.center_point,
    category: this.category,
    source: this.source,
    layer: this.layer,
    source_id: this.source_id,
    bounding_box: this.bounding_box,
    popularity: this.popularity,
    population: this.population,
    polygon: this.shape
  };

  // remove empty properties
  if( !Object.keys( doc.parent || {} ).length ){
    delete doc.parent;
  }
  if( !Object.keys( doc.address_parts || {} ).length ){
    delete doc.address_parts;
  }
  if( !( this.category || [] ).length ){
    delete doc.category;
  }
  if (!this.bounding_box) {
    delete doc.bounding_box;
  }
  if( !Object.keys( doc.center_point || {} ).length ){
    delete doc.center_point;
  }
  if (!this.population) {
    delete doc.population;
  }
  if (!this.popularity) {
    delete doc.popularity;
  }
  if( !Object.keys( doc.polygon || {} ).length ){
    delete doc.polygon;
  }

  return {
    _index: config.schema.indexName,
    _type: this.getType(),
    _id: this.getId(),
    data: doc
  };
};

// id
Document.prototype.setId = function( id ){

  id = transform.stringify(id);
  validate.type('string', id);
  validate.truthy(id);

  this._meta.id = id;
  return this;
};

Document.prototype.getId = function(){
  return this._meta.id;
};

// type
Document.prototype.setType = function( type ){

  validate.type('string', type);
  validate.truthy(type);

  this._meta.type = type;
  return this;
};

Document.prototype.getType = function(){
  return this._meta.type;
};

// source
Document.prototype.setSource = function( source ){

  source = transform.lowercase(source);
  validate.type('string', source);
  validate.truthy(source);

  this.source = source;
  return this;
};

Document.prototype.getSource = function(){
  return this.source;
};

// layer
Document.prototype.setLayer = function( layer ){

  layer = transform.lowercase(layer);
  validate.type('string', layer);
  validate.truthy(layer);

  this.layer = layer;
  return this;
};

Document.prototype.getLayer = function(){
  return this.layer;
};

// source id
Document.prototype.setSourceId = function( source_id ){

  source_id = transform.stringify(source_id);
  source_id = transform.lowercase(source_id);
  validate.type('string', source_id);
  validate.truthy(source_id);

  this.source_id = source_id;
  return this;
};

Document.prototype.getSourceId = function(){
  return this.source_id;
};

// globally unique id
Document.prototype.getGid = function(){
  return [ this.getSource(), this.getLayer(), this.getId() ].join(':');
};

// meta

Document.prototype.setMeta = function( prop, val ){
  this._meta[prop] = val;
  return this;
};

Document.prototype.getMeta = function( prop ){
  return this._meta[prop];
};

Document.prototype.hasMeta = function( prop ){
  return this._meta.hasOwnProperty( prop );
};

Document.prototype.delMeta = function( prop ){
  if( this.hasMeta( prop ) ){
    delete this._meta[ prop ];
    return true;
  }
  return false;
};

// names
Document.prototype.setName = function( prop, value ){

  validate.type('string', value);
  validate.truthy(value);

  // must copy name to 'phrase' index
  if( Array.isArray( this.name[ prop ] ) ){
    this.name[ prop ][ 0 ] = value;
    this.phrase[ prop ][ 0 ] = value;
  } else {
    this.name[ prop ] = value;
    this.phrase[ prop ] = value;
  }

  return this;
};

Document.prototype.setNameAlias = function( prop, value ){

  validate.type('string', value);
  validate.truthy(value);

  // is this the first time setting this prop? ensure it's an array
  if( !this.hasName( prop ) ){
    this.name[ prop ] = [];
    this.phrase[ prop ] = [];
  }

  // is casting required to convert a scalar field to an array?
  else if( 'string' === typeof this.name[ prop ] ){
    var stringValue = this.name[ prop ];
    this.name[ prop ] = [ stringValue ];
    this.phrase[ prop ] = [ stringValue ];
  }

  // is the array empty? ie. no prior call to setName()
  // in this case we will also set element 0 (the element used for display)
  if( !this.name[ prop ].length ){
    this.setName( prop, value );
  }

  // set the alias as the second, third, fourth, etc value in the array
  this.name[ prop ].push( value );
  this.phrase[ prop ].push( value );

  return this;
};

Document.prototype.getName = function( prop ){
  return Array.isArray( this.name[ prop ] ) ?
    this.name[ prop ][ 0 ] :
    this.name[ prop ];
};

Document.prototype.getNameAliases = function( prop ){
  return Array.isArray( this.name[ prop ] ) ?
    this.name[ prop ].slice( 1 ) :
    [];
};

Document.prototype.hasName = function( prop ){
  return this.name.hasOwnProperty( prop );
};

Document.prototype.delName = function( prop ){
  if( this.hasName( prop ) ){
    delete this.name[ prop ];
    return true;
  }
  return false;
};

// parent
Document.prototype.addParent = function( field, name, id, abbr ){

  var add = function( prop, value ){

    // create new parent array if required
    if( !this.parent.hasOwnProperty( prop ) ){
      this.parent[ prop ] = [];
    }

    // add value to array if not already present
    if( -1 === this.parent[prop].indexOf(value) ){
      this.parent[prop].push(value);
    }
  }.bind(this);

  var addValidate = function( prop, value ){
    validate.type('string', value);
    validate.truthy(value);
    add( prop, value );
  }.bind(this);

  // mandatory fields, eg: 'country', 'country_id'
  addValidate( field, name );
  addValidate( field + '_id', id );

  // optional field, eg: 'country_a', defaults to `null` for downstream ES
  /**
    note: the rationale for setting this field as 'null' instead of 'undefined'
    is so that each of the fields 'line-up'.

    == if you add a parent property with no abbreviation, as such:

    addParent( 'region', 'foobar', '1' )

    doc:
      parent.region       = [ 'foobar' ]
      parent.region_id    = [ '1' ]
      parent.region_a     = [ null ]

    == and then you add another parent property such as:

    addParent( 'region', 'bingobango', '2', 'bingo' )

    doc:
      parent.region       = [ 'foobar', 'bingobango' ]
      parent.region_id    = [ '1',      '2' ]
      parent.region_a     = [ null,     'bingo' ]

    == you can now be sure that the abbreviation 'bingo' belongs to '2' and not '1'.
  **/
  if (_.isUndefined(abbr)) {
    add( field + '_a', null );
  } else {
    addValidate( field + '_a', abbr );
  }

  // chainable
  return this;
};

// clear all all added values
Document.prototype.clearParent = function(field) {

  // field has never been set
  if( !this.parent.hasOwnProperty( field ) ){
    return this;
  }

  this.parent[ field ] = [];
  this.parent[ field + '_id' ] = [];
  this.parent[ field + '_a' ] = [];

  return this;
};

// convenience method for clearing all parents
Document.prototype.clearAllParents = function() {
  parentFields.forEach((parentField) => {
    this.clearParent.call( this, parentField );
  });
  return this;
};

// address
Document.prototype.setAddress = function( prop, value ){

  validate.property(addressFields, prop);
  validate.type('string', value);
  validate.truthy(value);

  this.address_parts[ prop ] = value;
  return this;
};

Document.prototype.getAddress = function( prop ){
  return this.address_parts[ prop ];
};

Document.prototype.hasAddress = function( prop ){
  return this.address_parts.hasOwnProperty( prop );
};

Document.prototype.delAddress = function( prop ){
  if( this.hasName( prop ) ){
    delete this.address_parts[ prop ];
    return true;
  }
  return false;
};

// population
Document.prototype.setPopulation = function( population ){

  validate.type('number', population);
  validate.nonnegative(population);

  this.population = population;
  return this;
};

Document.prototype.getPopulation = function(){
  return this.population;
};

// popularity
Document.prototype.setPopularity = function( popularity ){

  popularity = transform.roundify(popularity);
  validate.type('number', popularity);
  validate.nonnegative(popularity);

  this.popularity = popularity;
  return this;
};

Document.prototype.getPopularity = function(){
  return this.popularity;
};

// categories
Document.prototype.addCategory = function( value ){

  value = transform.lowercase(value);
  validate.type('string', value);
  validate.truthy(value);

  if( -1 === this.category.indexOf(value) ){
    this.category.push(value);
  }

  return this;
};

Document.prototype.removeCategory = function( value ){

  for(var i = this.category.length - 1; i >= 0; i--) {
    if(this.category[i] === value) {
      this.category.splice(i, 1);
    }
  }

  return this;
};

// centroid
Document.prototype.setCentroid = function( centroid ){
  centroid = centroid || {};

  centroid.lon = transform.floatify(6, centroid.lon);
  validate.type('number', centroid.lon);
  validate.geo('longitude', centroid.lon);

  centroid.lat = transform.floatify(6, centroid.lat);
  validate.type('number', centroid.lat);
  validate.geo('latitude', centroid.lat);

  // copy the lat/lon values instead of assigning the object or the object
  // could be changed outside
  this.center_point.lon = centroid.lon;
  this.center_point.lat = centroid.lat;

  return this;
};

Document.prototype.getCentroid = function(){
  return this.center_point;
};

// shape
Document.prototype.setPolygon = function( value ){

 validate.type('object', value);
 validate.truthy(value);

 this.shape = value;
 return this;
};

Document.prototype.getPolygon = function(){
  return this.shape;
};

// bounding box
// verify that the supplied bounding_box is a well-formed object, finally
// marshaling into a ES-specific format
Document.prototype.setBoundingBox = function( value ){

 validate.type('object', value);
 validate.boundingBox(value);
 value = transform.toULLR(value);

 this.bounding_box = value;
 return this;
};

Document.prototype.getBoundingBox = function(){
  return this.bounding_box;
};


Document.prototype.isSupportedParent = (placetype) => {
  return parentFields.indexOf(placetype) !== -1;
};

// return a clone so it's immutable
Document.prototype.getParentFields = () => {
  return _.cloneDeep(parentFields);
};

// export
module.exports = Document;
