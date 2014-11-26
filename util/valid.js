
module.exports.type = function( type ){
  return function( val ){
    if( type.toLowerCase() === 'array' ){
      if( !Array.isArray( val ) ){
        throw new Error( 'invalid document type, expecting: ' + type );
      }
    } else {
      if( typeof val !== type ){
        throw new Error( 'invalid document type, expecting: ' + type );
      }
      if( type === 'number' && isNaN( val ) ){
        throw new Error( 'invalid document type, expecting: number, got NaN' );
      }
      if( type === 'object' && Array.isArray( val ) ){
        throw new Error( 'invalid document type, expecting: object, got array' );
      }
      if( type === 'object' && null === val ){
        throw new Error( 'invalid document type, expecting: object, got null' );
      }
    }
  };
};

module.exports.truthy = function(){
  return function( val ){
    if( !val ){
      throw new Error( 'invalid document type, expecting: truthy' );
    }
  };
};

module.exports.length = function( length ){
  return function( val ){
    if( val.length !== length ){
      throw new Error( 'invalid property length, expecting: ' + length );
    }
  };
};

module.exports.geo = function( axis ){
  return function( val ){
    if( typeof val !== 'number' ){
      throw new Error( 'invalid geo ' + axis + ', expecting: number' );
    }
    if( axis === 'latitude' ){
      if( val < -90 || val > 90 ){
        throw new Error( 'invalid axis: ' + axis + ', ' + val );
      }
    } else if( axis === 'longitude' ){
      if( val < -180 || val > 180 ){
        throw new Error( 'invalid axis: ' + axis + ', ' + val );
      }
    } else {
      throw new Error( 'invalid axis: ' + axis );
    }
  };
};