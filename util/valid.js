
var _ = require('lodash'),
    PeliasModelError = require('../errors').PeliasModelError;

module.exports.type = function( type ){
  return function( val ){
    if( type.toLowerCase() === 'array' ){
      if( !Array.isArray( val ) ){
        throw new PeliasModelError( 'invalid document type, expecting: ' + type + ' got: ' + val );
      }
    } else {
      if( typeof val !== type ){
        throw new PeliasModelError( 'invalid document type, expecting: ' + type + ' got: ' + val );
      }
      if( type === 'number' && isNaN( val ) ){
        throw new PeliasModelError( 'invalid document type, expecting: number, got NaN: ' + val );
      }
      if( type === 'object' && Array.isArray( val ) ){
        throw new PeliasModelError( 'invalid document type, expecting: object, got array: ' + val );
      }
      if( type === 'object' && null === val ){
        throw new PeliasModelError( 'invalid document type, expecting: object, got null: ' + val );
      }
    }
  };
};

module.exports.truthy = function(){
  return function( val ){
    if( (typeof val === 'string' && !val.trim() ) || !val ){
      throw new PeliasModelError( 'invalid document type, expecting: truthy, got: ' + val );
    }
  };
};

module.exports.positive = function(){
  return function( val ){
    if( val < 0 ){
      throw new PeliasModelError( 'invalid document type, expecting: 0 or a positive number, got: ' + val );
    }
  };
};

module.exports.length = function( length ){
  return function( val ){
    if( val.length !== length ){
      throw new PeliasModelError( 'invalid property length, expecting: ' + length + ' got: ' + val);
    }
  };
};

module.exports.geo = function( axis ){
  return function( val ){
    if( typeof val !== 'number' ){
      throw new PeliasModelError( 'invalid geo ' + axis + ', expecting: number, got: ' + val );
    }
    if( axis === 'latitude' ){
      if( val < -90 || val > 90 ){
        throw new PeliasModelError( 'invalid axis: ' + axis + ', ' + val );
      }
    } else if( axis === 'longitude' ){
      if( val < -180 || val > 180 ){
        throw new PeliasModelError( 'invalid axis: ' + axis + ', ' + val );
      }
    } else {
      throw new PeliasModelError( 'invalid axis: ' + axis );
    }
  };
};

// validate prop against a properties whitelist
module.exports.property = function( propList ){
  return function( val, prop ){
    if( -1 === propList.indexOf( prop ) ){
      throw new PeliasModelError( 'invalid property: ' + prop + ', should be one of: ' + propList.join(',') );
    }
  };
};

module.exports.boundingBox = function() {
  return function ( val ) {
    // upperLeft must be an object
    if (!_.isObject(val.upperLeft)) {
      throw new PeliasModelError('invalid boundingBox, non-object property \'upperLeft\'');
    }
    // must have upperLeft.lat within valid range
    if (!_.isFinite(val.upperLeft.lat) || val.upperLeft.lat < -90 || val.upperLeft.lat > 90) {
      throw new PeliasModelError('invalid boundingBox, property \'upperLeft\.lat\' must be within range -90 to 90');
    }
    // must have upperLeft.lon within valid range
    if (!_.isFinite(val.upperLeft.lon) || val.upperLeft.lon < -180 || val.upperLeft.lon > 180) {
      throw new PeliasModelError('invalid boundingBox, property \'upperLeft\.lon\' must be within range -180 to 180');
    }

    // lowerRight must be an object
    if (!_.isObject(val.lowerRight)) {
      throw new PeliasModelError('invalid boundingBox, non-object property \'lowerRight\'');
    }
    // must have lowerRight.lat within valid range
    if (!_.isFinite(val.lowerRight.lat) || val.lowerRight.lat < -90 || val.lowerRight.lat > 90) {
      throw new PeliasModelError('invalid boundingBox, property \'lowerRight\.lat\' must be within range -90 to 90');
    }
    // must have lowerRight.lon within valid range
    if (!_.isFinite(val.lowerRight.lon) || val.lowerRight.lon < -180 || val.lowerRight.lon > 180) {
      throw new PeliasModelError('invalid boundingBox, property \'lowerRight\.lon\' must be within range -180 to 180');
    }

    // geometry must be internally consistent
    if (val.upperLeft.lat < val.lowerRight.lat) {
      throw new PeliasModelError('invalid boundingBox, upperLeft.lat must be >= lowerRight.lat');
    }

    // normalize lon values by adding 360 so that only positives are compared
    if (val.upperLeft.lon+360 > val.lowerRight.lon+360) {
      throw new PeliasModelError('invalid boundingBox, upperLeft.lon must be <= lowerRight.lon');
    }

  };

};
