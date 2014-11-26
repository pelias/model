
module.exports.get = function( prop ){
  if( !prop ){ throw new Error( 'invalid property' ); }
  return function(){
    return this[prop];
  };
};

module.exports.set = function( prop, validators, transformers ){
  if( !prop ){ throw new Error( 'invalid property' ); }
  return function( val ){
    if( !val ){ throw new Error( 'invalid value' ); }
    
    val = transform( val, transformers );
    validate( val, validators );
    this[prop] = val;

    // chain
    return this;
  };
};

module.exports.getChild = function( child ){
  if( !child ){ throw new Error( 'invalid child' ); }
  return function( prop ){
    if( !prop ){ throw new Error( 'invalid property' ); }
    return this[child][prop];
  };
};

module.exports.hasChild = function( child ){
  if( !child ){ throw new Error( 'invalid child' ); }
  return function( prop ){
    if( !prop ){ throw new Error( 'invalid property' ); }
    return this.hasOwnProperty(child) && this[child].hasOwnProperty(prop);
  };
};

module.exports.setChild = function( child, validators, transformers ){
  if( !child ){ throw new Error( 'invalid child' ); }
  return function( prop, val ){
    if( !prop ){ throw new Error( 'invalid property' ); }
    if( !val ){ throw new Error( 'invalid value' ); }

    val = transform( val, transformers );
    validate( val, validators );
    this[child][prop] = val;

    // chain
    return this;
  };
};

module.exports.delChild = function( child ){
  if( !child ){ throw new Error( 'invalid child' ); }
  return function( prop ){
    if( !prop ){ throw new Error( 'invalid property' ); }

    if( module.exports.hasChild( child ).call( this, prop ) ){
      delete this[child][prop];
      return true;
    }
    return false;
  };
};

function validate( val, validators ){
  if( validators ){
    validators.forEach( function( validator ) {
      validator( val );
    });
  }
}

function transform( val, transformers ){
  if( transformers ){
    transformers.forEach( function( transformer ) {
      val = transformer( val );
    });
  }
  return val;
}