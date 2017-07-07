var config = require('pelias-config').generate();

var validate = require('./util/valid');
var transform = require('./util/transform');
var _ = require('lodash');

const addressFields = ['name', 'number', 'street', 'zip'];

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
  'postalcode'
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
    source_id: this.source_id
  };

  // remove empty properties
  if( _.isEmpty( doc.name ) ){ delete doc.name; }
  if( _.isEmpty( doc.phrase ) ){ delete doc.phrase; }
  if( _.isEmpty( doc.parent ) ){ delete doc.parent; }
  if( _.isEmpty( doc.address_parts ) ){ delete doc.address_parts; }
  if( _.isEmpty( this.center_point ) ){ delete doc.center_point; }
  if( _.isEmpty( this.category ) ){ delete doc.category; }

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

// alpha3
Document.prototype.setAlpha3 = function( alpha3 ){

  alpha3 = transform.uppercase(alpha3);
  validate.type('string', alpha3);
  validate.truthy(alpha3);
  validate.length(3, alpha3);

  this.alpha3 = alpha3;
  return this;
};

Document.prototype.getAlpha3 = function(){
  return this.alpha3;
};

Document.prototype.clearAlpha3 = function(){
  delete this.alpha3;
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

  this.name[ prop ] = value;
  this.phrase[ prop ] = value; // must copy name to 'phrase' index
  return this;
};

Document.prototype.getName = function( prop ){
  return this.name[ prop ];
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

// longitude
Document.prototype.setLon = function( value ){

  value = transform.floatify(6, value);
  validate.type('number', value);
  validate.geo('longitude', value);

  this.center_point.lon = value;
  return this;
};

Document.prototype.getLon = function(){
  return this.center_point.lon;
};

// latitude
Document.prototype.setLat = function( value ){

  value = transform.floatify(6, value);
  validate.type('number', value);
  validate.geo('latitude', value);

  this.center_point.lat = value;
  return this;
};

Document.prototype.getLat = function(){
  return this.center_point.lat;
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
  this.setLon.call( this, centroid.lon );
  this.setLat.call( this, centroid.lat );
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
