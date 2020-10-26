const config = require('pelias-config').generate();
const getCountryISO2 = require('country-iso-3-to-2');
const validate = require('./util/valid');
const transform = require('./util/transform');
const _ = require('lodash');
const codec = require('./codec');

const addressFields = ['name', 'number', 'unit', 'street', 'cross_street', 'zip'];

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
  this.addendum = {};

  // create a non-enumerable property for metadata
  Object.defineProperty( this, '_meta', { writable: true, value: {} });

  // create a non-enumerable property for post-processing scripts
  Object.defineProperty( this, '_post', { writable: true, value: [] });

  // define default post-processing scripts
  this.addPostProcessingScript( require('./post/intersections') );
  this.addPostProcessingScript( require('./post/seperable_street_names').post );
  this.addPostProcessingScript( require('./post/deduplication') );
  this.addPostProcessingScript( require('./post/language_field_trimming') );

  // mandatory properties
  this.setSource( source );
  this.setLayer( layer );
  this.setSourceId( source_id );
  this.setId( source_id );
}

// add a post-processing script which is run before generating the ES document
Document.prototype.addPostProcessingScript = function( fn ){
  validate.type('function', fn);
  this._post.push(fn);
  return this;
};

// remove a post-processing script
Document.prototype.removePostProcessingScript = function( fn ){
  validate.type('function', fn);
  this._post = this._post.filter(p => p !== fn);
  return this;
};

// call all post-processing scripts
Document.prototype.callPostProcessingScripts = function(){
  this._post.forEach(function(fn){ fn.call(null, this); }, this);
  return this;
};

Document.prototype.toJSON = function(){
  return this;
};

/*
 * Returns an object in exactly the format that Elasticsearch wants for inserts
 */
Document.prototype.toESDocument = function() {

  try {
    // call all post-processing scripts
    this.callPostProcessingScripts();
  } catch (e) {
    console.error('a post processing error occurred');
    console.error(e);
  }

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
    addendum: {},
    shape: this.shape
  };

  // add encoded addendum namespaces
  for( var namespace in this.addendum || {} ){
    doc.addendum[namespace] = codec.encode(this.addendum[namespace]);
  }

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
  if( !Object.keys( doc.addendum || {} ).length ){
    delete doc.addendum;
  }
  if( !Object.keys( doc.shape || {} ).length ){
    delete doc.shape;
  }

  return {
    _index: _.get(config, 'schema.indexName', 'pelias'),
    _id: this.getGid(),
    // In ES7, the only allowed document type will be `_doc`.
    // However underscores are not allowed until ES6, so use `doc` for now
    // see https://github.com/elastic/elasticsearch/pull/27816
    _type: _.get(config, 'schema.typeName', 'doc'),
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
  validate.regex.nomatch(value, /https?:\/\//);

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
  validate.regex.nomatch(value, /https?:\/\//);

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
  if (typeof abbr === 'string') {
    addValidate( field + '_a', abbr );
  } else {
    add( field + '_a', null );
  }

  // Mild hack to add in iso2 country codes, since wof-admin-lookup puts iso3
  // country codes in country.abbrev.
  if (field === 'country') {
    const iso2 = getCountryISO2(abbr);
    if (iso2) {
      addValidate( field + '_a2', iso2 );
    } else {
      add( field + '_a2', null );
    }
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

  validate.type('string', value);
  validate.truthy(value);
  validate.property(addressFields, prop);
  validate.regex.nomatch(value, /https?:\/\//);

  if( Array.isArray( this.address_parts[ prop ] ) ){
    this.address_parts[ prop ][ 0 ] = value;
  } else {
    this.address_parts[ prop ] = value;
  }

  return this;
};

Document.prototype.setAddressAlias = function( prop, value ){

  validate.type('string', value);
  validate.truthy(value);
  validate.property(addressFields, prop);
  validate.regex.nomatch(value, /https?:\/\//);

  // is this the first time setting this prop? ensure it's an array
  if( !this.hasAddress( prop ) ){
    this.address_parts[ prop ] = [];
  }

  // is casting required to convert a scalar field to an array?
  else if( 'string' === typeof this.address_parts[ prop ] ){
    var stringValue = this.address_parts[ prop ];
    this.address_parts[ prop ] = [ stringValue ];
  }

  // is the array empty? ie. no prior call to setAddress()
  // in this case we will also set element 0 (the element used for display)
  if( !this.address_parts[ prop ].length ){
    this.setAddress( prop, value );
  }

  // set the alias as the second, third, fourth, etc value in the array
  this.address_parts[ prop ].push( value );

  return this;
};

Document.prototype.getAddress = function( prop ){
  return Array.isArray( this.address_parts[ prop ] ) ?
    this.address_parts[ prop ][ 0 ] :
    this.address_parts[ prop ];
};

Document.prototype.getAddressAliases = function( prop ){
  return Array.isArray( this.address_parts[ prop ] ) ?
    this.address_parts[ prop ].slice( 1 ) :
    [];
};

Document.prototype.hasAddress = function( prop ){
  return this.address_parts.hasOwnProperty( prop );
};

Document.prototype.delAddress = function( prop ){
  if( this.hasAddress( prop ) ){
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

// addendum
Document.prototype.setAddendum = function( namespace, value ){
  validate.type('string', namespace);
  validate.truthy(namespace);
  validate.type('object', value);
  if( Object.keys(value).length > 0 ){
    this.addendum[ namespace ] = value;
  }
  return this;
};

Document.prototype.getAddendum = function( namespace ){
  return this.addendum[ namespace ];
};

Document.prototype.hasAddendum = function( namespace ){
  return this.addendum.hasOwnProperty( namespace );
};

Document.prototype.delAddendum = function( namespace ){
  if( this.hasAddendum( namespace ) ){
    delete this.addendum[ namespace ];
    return true;
  }
  return false;
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
Document.prototype.setShape = function( value ){

 validate.type('object', value);
 validate.truthy(value);

 this.shape = value;
 return this;
};

Document.prototype.getShape = function(){
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
